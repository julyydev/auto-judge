use clap::{Args, Parser, Subcommand, ValueEnum};
use std::fmt;

#[derive(Parser)]
#[command(name = "aj")]
#[command(about = "Online Judge Automation Tool", long_about = None)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    /// Run tests for a specific problem
    Run(RunArgs),

    /// Configure default values and commands
    Config(ConfigArgs),
}

/// `Run` 명령어의 인자를 정의하는 구조체
#[derive(Debug, Args)]
pub struct RunArgs {
    /// Problem ID to fetch test cases (required)
    pub problem_id: String,

    /// Platform to fetch the problem from. (optional, default: "boj")
    #[arg(short = 'p', long = "platform", default_value_t = OnlineJudgePlatform::Boj)]
    pub online_judge_platform: OnlineJudgePlatform,

    /// Path to the source code file. (optional, default: "main.cpp")
    #[arg(short = 's', long = "source", default_value = "main.cpp")]
    pub source_file: String,

    /// Test case ID to run (optional).
    /// If not provided, all test cases will be run.
    #[arg(short = 't', long = "test-case")]
    pub test_case: Option<String>,
}

/// `Config` 명령어의 인자를 정의하는 구조체
#[derive(Debug, Args)]
pub struct ConfigArgs {
    #[command(subcommand)]
    pub config_command: ConfigCommands,
}

#[derive(Subcommand, Debug)]
pub enum ConfigCommands {
    /// Show current configuration
    Show,
}

#[derive(ValueEnum, Clone, Debug)]
pub enum OnlineJudgePlatform {
    Boj,
}

// Display 트레이트 구현
impl fmt::Display for OnlineJudgePlatform {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            OnlineJudgePlatform::Boj => write!(f, "boj"),
        }
    }
}

pub fn parse_args() -> Cli {
    Cli::parse()
}
