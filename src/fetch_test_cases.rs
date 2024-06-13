use crate::args::Platform;
use crate::constants::fetch::{BOJ_BASE_URL, BOJ_USER_AGENT};
use crate::utils::spinner;
use crate::utils::time;
use colored::Colorize;
use reqwest::Client;
use scraper::{Html, Selector};
use std::error::Error;

#[derive(Clone, Debug)]
pub struct TestCase {
    pub id: String,
    pub input: String,
    pub output: String,
}

pub async fn fetch_test_cases(id: &str, platform: Platform) -> Vec<TestCase> {
    let spinner = spinner::start(&format!("Fetching {:?} {} Test Cases...", platform, id));
    let time = time::start();

    let result = match platform {
        Platform::Boj => fetch_boj_test_cases(id).await,
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
    let client = Client::new();
    let res = client
        .get(format!("{}/{}", BOJ_BASE_URL, id))
        .header("User-Agent", BOJ_USER_AGENT)
        .send()
        .await?;

    if res.status().is_success() {
        let body = res.text().await?;
        let test_cases = parse_test_cases(&body)?;
        Ok(test_cases)
    } else {
        Err(Box::new(std::io::Error::new(
            std::io::ErrorKind::Other,
            format!("Failed to fetch test cases: HTTP {}", res.status()),
        )))
    }
}

fn parse_test_cases(body: &str) -> Result<Vec<TestCase>, Box<dyn Error>> {
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
            TestCase { id: (i + 1).to_string(), input, output }
        })
        .collect();

    Ok(test_cases)
}
