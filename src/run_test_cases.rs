use crate::args::Platform;
use crate::constants::config::DIRECTORY_NAME;
use crate::fetch_test_cases::TestCase;
use crate::utils::{spinner, time};
use colored::Colorize;
use futures::future::join_all;
use std::error::Error;
use std::io::Write;
use std::process::{Command, Stdio};
use tokio::time::{timeout, Duration};

#[derive(Debug, Clone)]
struct TestResult {
    number: usize,
    is_success: bool,
    time: String,
    expected: String,
    received: String,
}

#[derive(Debug, Clone)]
struct RunResult {
    is_all_success: bool,
    test_results: Vec<TestResult>,
    total_count: usize,
    passed_count: usize,
    failed_count: usize,
}

pub async fn run_test_cases(
    platform: Platform,
    id: String,
    test_cases: &[TestCase],
    specific_test_case: Option<String>,
) -> Result<(), Box<dyn Error + Send + Sync>> {
    let spinner = spinner::start("Running Test Cases...");
    let start_time = time::start();

    let mut handles = vec![];

    for (i, test_case) in test_cases.iter().cloned().enumerate() {
        let specific_test_case = specific_test_case.clone();
        let test_case = test_case.clone();
        let handle = tokio::spawn(async move {
            let result: Result<Option<TestResult>, Box<dyn Error + Send + Sync>> =
                timeout(Duration::from_secs(2), async {
                    let test_case_name = format!("test_case_{}", i + 1);

                    if let Some(ref specific_test_case) = specific_test_case {
                        if specific_test_case != &test_case_name {
                            return Ok(None);
                        }
                    }

                    let start_time = tokio::time::Instant::now();
                    let output = run_single_test_case(&test_case).await?;
                    let duration = start_time.elapsed();

                    let success = output.trim() == test_case.output.trim();

                    Ok(Some(TestResult {
                        number: i + 1,
                        is_success: success,
                        time: format!("{} ms", duration.as_millis()),
                        expected: test_case.output.clone(),
                        received: output,
                    }))
                })
                .await
                .unwrap_or(Ok(Some(TestResult {
                    number: i + 1,
                    is_success: false,
                    time: "timeout".to_string(),
                    expected: test_case.output.clone(),
                    received: "timeout".to_string(),
                })));

            result
        });

        handles.push(handle);
    }

    let results: Vec<Result<Option<TestResult>, Box<dyn Error + Send + Sync>>> = join_all(handles)
        .await
        .into_iter()
        .map(|res| res.unwrap_or(Ok(None)))
        .collect();

    let mut test_results = Vec::new();
    let mut num_success = 0;
    let mut num_failure = 0;

    for result in results {
        if let Ok(Some(test_result)) = result {
            if test_result.is_success {
                num_success += 1;
            } else {
                num_failure += 1;
            }
            test_results.push(test_result);
        } else {
            num_failure += 1;
        }
    }

    spinner::done(&spinner, "Running Test Cases Completed");

    let run_result = RunResult {
        is_all_success: num_failure == 0,
        test_results,
        total_count: test_cases.len(),
        passed_count: num_success,
        failed_count: num_failure,
    };

    print_results(platform, id, &run_result);
    time::print_duration(start_time, "Total Run Time:");

    Ok(())
}

async fn run_single_test_case(
    test_case: &TestCase,
) -> Result<String, Box<dyn Error + Send + Sync>> {
    let test_case_input = test_case.input.clone();
    let output =
        tokio::task::spawn_blocking(move || -> Result<String, Box<dyn Error + Send + Sync>> {
            let mut child = Command::new(format!("{}/out", DIRECTORY_NAME))
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .spawn()?;

            if let Some(ref mut stdin) = child.stdin {
                stdin.write_all(test_case_input.as_bytes())?;
            }

            let output = child.wait_with_output()?;
            let stdout = String::from_utf8_lossy(&output.stdout).to_string();

            Ok(stdout)
        })
        .await??;

    Ok(output)
}

fn print_results(platform: Platform, id: String, run_result: &RunResult) {
    println!();

    if run_result.is_all_success {
        println!("{}", " PASS ".on_green().black().bold());
    } else {
        println!("{}", " FAIL ".on_red().black().bold());
    }

    for result in &run_result.test_results {
        let status = if result.is_success {
            { "✔" }.green()
        } else {
            { "✕" }.red()
        };

        println!(
            "    {} {}",
            status,
            format!("test case #{} ({})", result.number, result.time).dimmed()
        );
    }
    println!();

    let failed_results: Vec<&TestResult> = run_result
        .test_results
        .iter()
        .filter(|result| !result.is_success)
        .collect();

    for result in &failed_results {
        if result.time == "timeout" {
            continue;
        }

        println!(
            "{}\n",
            format!("  ● {:?} {} > test case {}", platform, id, result.number).red()
        );

        let expected_lines: Vec<&str> = result.expected.split('\n').collect();
        let received_lines: Vec<&str> = result.received.split('\n').collect();

        println!("    Expected: {}", expected_lines[0].green());
        for line in expected_lines.iter().skip(1) {
            println!("              {}", line.green());
        }

        println!("    Received: {}", received_lines[0].red());
        for line in received_lines.iter().skip(1) {
            println!("              {}", line.red());
        }

        println!();
    }

    println!(
        "Result: {}, {}, {}",
        format_count(run_result.passed_count, "passed", |s| s.green()),
        format_count(run_result.failed_count, "failed", |s| s.red()),
        format!("{} total", run_result.total_count)
    );
}

fn format_count(
    count: usize,
    label: &str,
    color: fn(String) -> colored::ColoredString,
) -> colored::ColoredString {
    if count == 0 {
        format!("{} {}", count, label).normal()
    } else {
        color(format!("{} {}", count, label)).bold()
    }
}
