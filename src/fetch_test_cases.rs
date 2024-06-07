use crate::args::Platform;

pub struct TestCase {
    pub input: String,
    pub output: String,
}

pub fn fetch_test_cases(id: &str, platform: Platform) -> Vec<TestCase> {
    // TODO: 온라인 저지 사이트에서 테스트케이스들을 크롤링해오는 로직을 구현합니다.
    println!(
        "Fetching test cases for ID: {}, Platform: {:?}",
        id, platform
    );
    // 예시 반환값, 실제로는 크롤링한 데이터를 반환해야 합니다.
    vec![TestCase {
        input: "1 2".to_string(),
        output: "3".to_string(),
    }]
}

pub fn print_test_cases(test_cases: &Vec<TestCase>) {
    // DEBUG
    for (i, test_case) in test_cases.iter().enumerate() {
        println!("Test Case #{}", i + 1);
        println!("Input: {}", test_case.input);
        println!("Output: {}", test_case.output);
        println!();
    }
}
