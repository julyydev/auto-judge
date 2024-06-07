use crate::args::Args;
use crate::get_config::get_config;
use clap::Parser;

pub fn get_args() -> Args {
    let args = Args::parse();

    let default_args = get_config();

    Args {
        id: args.id,
        platform: args.platform,
        file: args.file.or(default_args.file),
        test_case: args.test_case.or(default_args.test_case),
    }
}
