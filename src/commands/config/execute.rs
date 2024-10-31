use crate::cli::{ConfigArgs, ConfigCommands};

pub fn execute_config(config_args: ConfigArgs) {
    match config_args.config_command {
        ConfigCommands::Show => {
            // TODO: Implement show configuration
            println!("Show configuration");
        }
    }
}
