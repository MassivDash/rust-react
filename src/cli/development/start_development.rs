use crate::cli::config::get_config::Config;
use crate::cli::pre_run::npm::NPM;
use crate::cli::utils::terminal::{dev_info, step, success, warning};
use ctrlc::set_handler;
use std::io::Read;
use std::process::Command;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

/// Start the development server
/// The development server will start the actix backend server and the astro frontend server
/// The development server will also check if the port is available for the backend server, and loop until it finds the available port
/// The development server will also clean up the orphaned processes, otherwise cargo watch and node watch will continue to run, blocking the ports.

pub fn start_development(config: Config) {
    // Set the ctrl-c handler to exit the program and clean up orphaned processes
    let running = Arc::new(AtomicBool::new(true));
    let r = running.clone();

    set_handler(move || {
        r.store(false, Ordering::SeqCst);
    })
    .expect("Error setting Ctrl-C handler");

    // Check if the port is available for the backend server

    print!("{}", &config.astro_port.is_some().to_string());

    let mut port = config.port.unwrap_or(8080);
    let mut listener = std::net::TcpListener::bind(format!("{}:{}", config.host, port));

    let astro_port = config.astro_port.unwrap_or(5431);
    // Loop until you find the port that is available

    while listener.is_err() {
        warning(format!("Port {} is not available", port).as_str());
        port += 1;
        listener = std::net::TcpListener::bind(format!("{}:{}", config.host, port));
    }

    // kill the listener

    drop(listener);

    // Start the backend development server

    step("Start the actix backend development server");

    let mut cargo_watch = Command::new("cargo")
        .current_dir("./src/backend")
        .arg("watch")
        .arg("-w")
        .arg("./src")
        .arg("-x")
        .arg(format!("run -- --host={} --port={}", config.host, port))
        .stdout(std::process::Stdio::piped())
        .spawn()
        .expect("Failed to start backend development server");

    // Wait for the backend development server to start

    let mut buffer_rust = [0; 1024];
    let mut stdout_rust = cargo_watch.stdout.take().unwrap();
    loop {
        let n = stdout_rust.read(&mut buffer_rust).unwrap();
        if n == 0 {
            break;
        }
        let s = String::from_utf8_lossy(&buffer_rust[..n]);

        print!("{}", s);
        if s.contains("HttpServer has started") {
            dev_info(&config.host, &port);
            success("Actix server is running, starting the frontend development server");
            break;
        }
    }

    // Start the frontend development server

    step("Starting astro frontend development server");

    let mut node_watch = Command::new(NPM)
        .arg("run")
        .arg("start")
        .arg("--")
        .arg("--port")
        .arg(astro_port.to_string())
        .stdout(std::process::Stdio::piped())
        .current_dir("./src/frontend")
        .spawn()
        .expect("Failed to start frontend development server");

    // Watch the std output of astro bundle if std will have "ready" then open the browser to the development server

    let mut buffer_node = [0; 1024];
    let mut stdout_node = node_watch.stdout.take().unwrap();
    loop {
        let n = stdout_node.read(&mut buffer_node).unwrap();
        if n == 0 {
            break;
        }
        let s = String::from_utf8_lossy(&buffer_node[..n]);

        print!("{}", s);

        if s.contains("ready") {
            success("Astro is ready, opening the browser");
            Command::new("open")
                .arg(format!("http://localhost:{}", astro_port))
                .spawn()
                .expect("Failed to open the browser");
            break;
        }
    }

    // Clean up section for orphaned processes, otherwise cargo watch and node watch will continue to run blocking the ports
    while running.load(Ordering::SeqCst) {}
    step("Cleaning up orphaned processes");

    cargo_watch
        .kill()
        .expect("Failed to kill cargo-watch process");
    node_watch
        .kill()
        .expect("Failed to kill node-watch process");

    step("Exiting");

    std::process::exit(0);
}
