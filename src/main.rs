mod args;
mod compile;
mod constants;
mod fetch_test_cases;
mod get_args;
mod get_config;
mod run_test_cases;
mod utils;

use crate::compile::compile;
use crate::fetch_test_cases::fetch_test_cases;
use crate::get_args::get_args;
use crate::run_test_cases::run_test_cases;
use crate::utils::dir::init_auto_judge;

#[tokio::main]
async fn main() {
    let _cleanup = match init_auto_judge() {
        Some(cleanup) => cleanup,
        None => return,
    };

    let args = get_args();

    let test_cases = fetch_test_cases(&args.id, args.platform).await;

    if let Some(ref file) = args.file {
        let res = compile(file);
        if let Err(e) = res {
            eprintln!("Error compiling file: {}", e);
            return;
        }
    }

    run_test_cases(args.platform, args.id, &test_cases, args.test_case)
        .await
        .unwrap();
}
