use crate::constants::config::DIRECTORY_NAME;
use std::error::Error;
use std::fs;
use std::path::Path;

pub struct AutoJudgeCleanup;

impl Drop for AutoJudgeCleanup {
    fn drop(&mut self) {
        if let Err(e) = fs::remove_dir_all(DIRECTORY_NAME) {
            eprintln!("Failed to remove {} directory: {}", DIRECTORY_NAME, e);
        }
    }
}

fn create_auto_judge_dir() -> Result<(), Box<dyn Error>> {
    if !Path::new(DIRECTORY_NAME).exists() {
        fs::create_dir(DIRECTORY_NAME)?;
    }
    Ok(())
}

fn init_auto_judge_dir() -> Result<AutoJudgeCleanup, Box<dyn Error>> {
    create_auto_judge_dir()?;
    Ok(AutoJudgeCleanup)
}

pub fn init_auto_judge() -> Option<AutoJudgeCleanup> {
    match init_auto_judge_dir() {
        Ok(cleanup) => Some(cleanup),
        Err(e) => {
            eprintln!("Failed to initialize {} directory: {}", DIRECTORY_NAME, e);
            None
        }
    }
}
