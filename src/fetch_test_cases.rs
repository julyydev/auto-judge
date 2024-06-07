use crate::args::Platform;
use crate::constants::fetch::{BOJ_BASE_URL, BOJ_USER_AGENT};
use reqwest::Client;
use scraper::{Html, Selector};
use std::error::Error;

pub struct TestCase {
    pub input: String,
    pub output: String,
}

pub async fn fetch_test_cases(id: &str, platform: Platform) -> Vec<TestCase> {
    println!(
        "Fetching test cases for ID: {}, Platform: {:?}",
        id, platform
    );

    match platform {
        Platform::Boj => fetch_boj_test_cases(id).await,
    }
    .unwrap_or_else(|e| {
        eprintln!("Error fetching test cases: {}", e);
        vec![]
    })
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
        .map(|(input_element, output_element)| {
            let input = input_element.text().collect::<Vec<_>>().join("");
            let output = output_element.text().collect::<Vec<_>>().join("");
            TestCase { input, output }
        })
        .collect();

    Ok(test_cases)
}

pub fn print_test_cases(test_cases: &[TestCase]) {
    for (i, test_case) in test_cases.iter().enumerate() {
        println!("Test Case #{}", i + 1);
        println!("Input: \n{}", test_case.input);
        println!("Output: \n{}", test_case.output);
        println!();
    }
}
