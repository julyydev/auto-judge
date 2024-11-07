use super::lib::fetch_test_cases::fetch_test_cases;
use crate::cli::RunArgs;

pub async fn execute_run(run_args: RunArgs) {
    let test_cases = fetch_test_cases(&run_args.problem_id, run_args.online_judge_platform).await;

    // FIXME: Debugging
    for tc in test_cases {
        println!("Test case: {}", tc.id);
        println!("Input: {}", tc.input);
        println!("Output: {}", tc.output);
        println!();
    }
}
