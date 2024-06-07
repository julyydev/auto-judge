use crate::args::{Args, Platform};

pub fn get_config() -> Args {
    let config: Args = Args {
        id: "1234".to_string(),
        platform: Platform::Boj,
        file: "main.cpp".to_string().into(),
        test_case: None,
    };

    config
}
