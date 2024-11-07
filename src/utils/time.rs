use colored::Colorize;
use std::time::Instant;

pub fn start() -> Instant {
    Instant::now()
}

pub fn print_duration(time: Instant, label: &str) {
    let duration = time.elapsed();
    let message = format!("- {}: {:.2?}", label, duration).dimmed();
    println!("{}", message);
}
