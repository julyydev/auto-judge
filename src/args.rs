use clap::{Parser, ValueEnum};
use std::fmt;

#[derive(Copy, Clone, PartialEq, Eq, PartialOrd, Ord, ValueEnum, Debug)]
pub enum Platform {
    Boj,
}

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
pub struct Args {
    pub id: String,

    #[clap(short, long, value_enum, default_value_t = Platform::Boj)]
    pub platform: Platform,

    #[clap(short, long)]
    pub file: Option<String>,

    #[clap(short, long)]
    pub test_case: Option<String>,
}

impl fmt::Display for Args {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "ID: {}\nPlatform: {:?}\nFile: {:?}\nTest Case: {:?}",
            self.id, self.platform, self.file, self.test_case
        )
    }
}
