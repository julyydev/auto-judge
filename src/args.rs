use clap::{Parser, ValueEnum};

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
pub struct Args {
    /// 문제 ID
    pub id: String,

    /// 온라인 저지 플랫폼 (현재는 'boj'만 가능)
    #[clap(short, long, value_enum, default_value_t = Platform::Boj)]
    pub platform: Platform,

    /// 타겟 소스 파일명
    #[clap(short, long)]
    pub file: Option<String>,

    /// 특정 테스트케이스만 실행
    #[clap(short, long)]
    pub test_case: Option<String>,
}

#[derive(Copy, Clone, PartialEq, Eq, PartialOrd, Ord, ValueEnum, Debug)]
pub enum Platform {
    Boj,
}

pub fn print_args(args: &Args) {
    // DEBUG
    println!("ID: {}", args.id);
    println!("Platform: {:?}", args.platform);
    println!("File: {:?}", args.file);
    println!("Test Case: {:?}", args.test_case);
    println!();
}
