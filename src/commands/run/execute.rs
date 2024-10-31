use crate::cli::RunArgs;

pub fn execute_run(run_args: RunArgs) {
    println!("Running test cases");
    println!("{:?}", run_args);
}
