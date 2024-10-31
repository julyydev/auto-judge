mod cli;
mod commands;

use cli::{parse_args, Commands};
use commands::{config::execute::execute_config, run::execute::execute_run};

fn main() {
    let cli = parse_args();

    match cli.command {
        Commands::Run(run_args) => {
            execute_run(run_args);
        }
        Commands::Config(config_args) => {
            execute_config(config_args);
        }
    }
}
