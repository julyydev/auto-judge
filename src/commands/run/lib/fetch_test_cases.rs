use super::super::types::test_case::TestCase;
use crate::cli::OnlineJudgePlatform;
use crate::constants::platform::{BOJ_BASE_URL, BOJ_USER_AGENT};
use crate::utils::spinner;
use crate::utils::time;
use colored::Colorize;
use reqwest::Client;
use scraper::{Html, Selector};
use std::error::Error;

pub async fn fetch_test_cases(id: &str, platform: OnlineJudgePlatform) -> Vec<TestCase> {
    let spinner = spinner::start(&format!("Fetching {:?} {} Test Cases...", platform, id));
    let time = time::start();

    let result = match platform {
        OnlineJudgePlatform::Boj => fetch_boj_test_cases(id).await,
    };

    let res = match result {
        Ok(test_cases) => {
            spinner::done(
                &spinner,
                &format!("Fetched {:?} {} Test Cases", platform, id),
            );
            test_cases
        }
        Err(e) => {
            spinner::error(
                &spinner,
                &format!("Fetched {:?} {} Test Cases", platform, id),
            );
            eprintln!("{}", format!("❗️ {}", e).dimmed());
            vec![]
        }
    };

    time::print_duration(time, "Fetched Time:");
    println!();

    res
}

async fn fetch_boj_test_cases(id: &str) -> Result<Vec<TestCase>, Box<dyn Error>> {
    let res = Client::new()
        .get(format!("{}/{}", BOJ_BASE_URL, id))
        .header("User-Agent", BOJ_USER_AGENT)
        .send()
        .await?;

    if res.status().is_success() {
        let body = res.text().await?;
        let test_cases = parse_boj_html(&body)?;
        Ok(test_cases)
    } else {
        Err(Box::new(std::io::Error::new(
            std::io::ErrorKind::Other,
            format!("Failed to fetch test cases: HTTP {}", res.status()),
        )))
    }
}

fn parse_boj_html(body: &str) -> Result<Vec<TestCase>, Box<dyn Error>> {
    let document = Html::parse_document(body);
    let selector_input = Selector::parse("[id^=sample-input]")?;
    let selector_output = Selector::parse("[id^=sample-output]")?;

    let test_cases = document
        .select(&selector_input)
        .zip(document.select(&selector_output))
        .enumerate()
        .map(|(i, (input_element, output_element))| {
            let input = input_element.text().collect::<Vec<_>>().join("");
            let output = output_element.text().collect::<Vec<_>>().join("");
            TestCase {
                id: (i + 1).to_string(),
                input,
                output,
            }
        })
        .collect();

    Ok(test_cases)
}
