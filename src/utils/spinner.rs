use indicatif::{ProgressBar, ProgressStyle};
use std::time::Duration;

pub fn start(message: &str) -> ProgressBar {
    let spinner = ProgressBar::new_spinner();
    spinner.set_style(
        ProgressStyle::default_spinner()
            .template("{spinner:.green} {msg}")
            .unwrap()
            .tick_strings(&["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]),
    );

    spinner.enable_steady_tick(Duration::from_millis(100));
    spinner.set_message(message.to_string());

    spinner
}

pub fn done(spinner: &ProgressBar, message: &str) {
    spinner.set_style(
        ProgressStyle::default_spinner()
            .template("{spinner:.green} {msg}")
            .unwrap()
            .tick_strings(&["✔"]),
    );
    spinner.finish_with_message(format!("[Done] {}", message.to_string()));
}

pub fn error(spinner: &ProgressBar, message: &str) {
    spinner.set_style(
        ProgressStyle::default_spinner()
            .template("{spinner:.red} {msg}")
            .unwrap()
            .tick_strings(&["✖"]),
    );
    spinner.finish_with_message(format!("[Error] {}", message.to_string()));
}
