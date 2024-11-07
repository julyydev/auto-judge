mod cli;
mod commands;
mod constants;
mod utils;

use cli::{parse_args, Commands};
use commands::{config::execute::execute_config, run::execute::execute_run};

#[tokio::main]
async fn main() {
    let cli = parse_args();

    match cli.command {
        Commands::Run(run_args) => execute_run(run_args).await,
        Commands::Config(config_args) => execute_config(config_args),
    }
}
