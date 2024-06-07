use crate::fetch_test_cases::TestCase;

pub fn run_test_cases(test_cases: &Vec<TestCase>, specific_test_case: Option<String>) {
    // TODO: 각 테스트케이스별로 프로그램을 실행하고 결과를 비교하는 로직을 구현합니다.
    if let Some(ref test_case) = specific_test_case {
        println!("Running specific test case: {}", test_case);
        // 특정 테스트 케이스만 실행하는 로직
    } else {
        println!("Running all test cases");
        // 모든 테스트 케이스를 실행하는 로직
    }

    for (_, test_case) in test_cases.iter().enumerate() {
        println!(
            "Input: {}, Expected Output: {}",
            test_case.input, test_case.output
        );
    }
}
