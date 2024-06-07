mod args;
mod compile;
mod fetch_test_cases;
mod get_args;
mod get_config;
mod run_test_cases;

use crate::args::print_args;
use crate::compile::compile;
use crate::fetch_test_cases::{fetch_test_cases, print_test_cases};
use crate::get_args::get_args;
use crate::run_test_cases::run_test_cases;

fn main() {
    let args = get_args();
    print_args(&args);

    let test_cases = fetch_test_cases(&args.id, args.platform);
    print_test_cases(&test_cases);

    if let Some(ref file) = args.file {
        compile(file);
    }

    run_test_cases(&test_cases, args.test_case);
}
