use crate::constants::config::DIRECTORY_NAME;
use crate::utils::{spinner, time};
use std::error::Error;
use std::fs;
use std::process::{Command, Output};

pub fn compile(file: &str) -> Result<Output, Box<dyn Error>> {
    let spinner = spinner::start(&format!("Compiling {}...", file));
    let time = time::start();

    if !fs::metadata(file).is_ok() {
        return Err(Box::new(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            format!("File not found: {}", file),
        )));
    }

    let output = Command::new("g++")
        .arg(file)
        .arg("-o")
        .arg(format!("{}/out", DIRECTORY_NAME))
        .output()?;

    if output.status.success() {
        spinner::done(&spinner, &format!("Compile {}", file));
    } else {
        spinner::error(&spinner, &format!("Compile {}", file));
        eprintln!("{}", String::from_utf8_lossy(&output.stderr));
    }
    time::print_duration(time, "Compile Time:");
    println!();

    Ok(output)
}
