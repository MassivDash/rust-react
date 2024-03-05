use super::collect_args::collect_config_args;
use super::toml::read_toml;
use serde::Deserialize;
use serde::Serialize;

#[derive(Deserialize, Debug, Serialize, PartialEq)]
pub struct Config {
    pub host: String,
    pub port: Option<u16>,
    pub env: String,
    pub astro_port: Option<u16>,
    pub prod_astro_build: bool,
    pub public_keys: PublicKeys,
}

#[derive(Deserialize, Debug, Serialize, PartialEq)]
pub struct PublicKeys {
    pub public_api_url: String,
}

pub fn get_config(args: &Vec<String>) -> Config {
    // create default config

    let mut config: Config = Config {
        host: "localhost".to_string(),
        port: Some(8080),
        env: "dev".to_string(),
        astro_port: Some(5431),
        prod_astro_build: false,
        public_keys: PublicKeys {
            public_api_url: "http://localhost:8080/api".to_string(),
        },
    };

    let file_name = "Astrox.toml".to_string();

    let toml = read_toml(&file_name);

    if toml.is_ok() {
        config = toml.unwrap();
    }

    config = collect_config_args(config, args);

    config
}
