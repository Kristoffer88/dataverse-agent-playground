#!/usr/bin/env node

/**
 * Node.js port of the shoreman script for running Procfile-based applications.
 * Based on the original shoreman implementation from https://github.com/mitsuhiko/minibb/blob/main/scripts/shoreman.sh
 * 
 * This script provides cross-platform process management with:
 * - PID tracking to prevent duplicate processes
 * - Timestamped logging to dev.log
 * - Colored console output
 * - Graceful shutdown handling
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

// Configuration
const PIDFILE = '.shoreman.pid';
const LOGFILE = 'dev.log';
const PREV_LOGFILE = 'dev-prev.log';
// Look for Procfile in scripts directory first, then project root
const PROCFILE = process.argv[2] || (fs.existsSync(path.join(__dirname, 'Procfile')) ? path.join(__dirname, 'Procfile') : 'Procfile');
const ENVFILE = process.argv[3] || '.env';

// ANSI color codes
const colors = [
    '\x1b[31m', // red
    '\x1b[32m', // green
    '\x1b[33m', // yellow
    '\x1b[34m', // blue
    '\x1b[35m', // magenta
    '\x1b[36m', // cyan
    '\x1b[37m', // white
];
const resetColor = '\x1b[0m';

// Process tracking
const processes = new Map();
let logStream;

// Logging functions
function getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0]; // HH:MM:SS
}

function log(processName, message, colorIndex) {
    const timestamp = getTimestamp();
    const color = colors[colorIndex % colors.length];
    
    // Console output with color
    if (process.stdout.isTTY) {
        console.log(`${color}${timestamp} ${processName}\t|${resetColor} ${message}`);
    } else {
        console.log(`${timestamp} ${processName}\t| ${message}`);
    }
    
    // File output without color
    if (logStream) {
        logStream.write(`${timestamp} ${processName}\t| ${message}\n`);
    }
}

// Check if already running
function checkAlreadyRunning() {
    if (fs.existsSync(PIDFILE)) {
        try {
            const pid = fs.readFileSync(PIDFILE, 'utf8').trim();
            // Check if process is actually running
            process.kill(parseInt(pid), 0);
            console.error("error: services are already running. that's good, we autoreload. no need to do anything");
            process.exit(1);
        } catch (e) {
            // Process not running, remove stale PID file
            fs.unlinkSync(PIDFILE);
        }
    }
}

// Load environment file
function loadEnvFile() {
    if (fs.existsSync(ENVFILE)) {
        const envContent = fs.readFileSync(ENVFILE, 'utf8');
        const lines = envContent.split('\n');
        
        lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#') && line.includes('=')) {
                const [key, ...valueParts] = line.split('=');
                const value = valueParts.join('=').replace(/^["']|["']$/g, '');
                process.env[key] = value;
            }
        });
    }
}

// Parse Procfile
function parseProcfile() {
    if (!fs.existsSync(PROCFILE)) {
        console.error(`Error: ${PROCFILE} not found`);
        process.exit(1);
    }
    
    const content = fs.readFileSync(PROCFILE, 'utf8');
    const lines = content.split('\n');
    const commands = [];
    
    lines.forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const name = line.substring(0, colonIndex).trim();
                const command = line.substring(colonIndex + 1).trim();
                commands.push({ name, command });
            }
        }
    });
    
    return commands;
}

// Start a command
function startCommand(name, command, index) {
    const [cmd, ...args] = command.split(' ');
    
    const child = spawn(cmd, args, {
        shell: true,
        stdio: ['inherit', 'pipe', 'pipe']
    });
    
    processes.set(child.pid, { name, process: child });
    
    log(name, `'${command}' started with pid ${child.pid}`, index);
    
    // Handle stdout
    const rlOut = readline.createInterface({
        input: child.stdout,
        crlfDelay: Infinity
    });
    
    rlOut.on('line', (line) => {
        log(name, line, index);
    });
    
    // Handle stderr
    const rlErr = readline.createInterface({
        input: child.stderr,
        crlfDelay: Infinity
    });
    
    rlErr.on('line', (line) => {
        log(name, line, index);
    });
    
    // Handle exit
    child.on('exit', (code, signal) => {
        processes.delete(child.pid);
        if (signal) {
            log(name, `Process terminated by signal ${signal}`, index);
        } else {
            log(name, `Process exited with code ${code}`, index);
        }
    });
}

// Cleanup function
function cleanup() {
    console.error('\nSIGINT received');
    console.error('sending SIGTERM to all processes');
    
    if (logStream) {
        logStream.write(`${getTimestamp()} PROCESS MANAGER SHUTTING DOWN\n`);
    }
    
    // Kill all child processes
    processes.forEach(({ process }) => {
        try {
            process.kill('SIGTERM');
        } catch (e) {
            // Process might already be dead
        }
    });
    
    // Remove PID file
    if (fs.existsSync(PIDFILE)) {
        fs.unlinkSync(PIDFILE);
    }
    
    // Close log stream
    if (logStream) {
        logStream.end();
    }
    
    setTimeout(() => {
        process.exit(0);
    }, 1000);
}

// Main function
function main() {
    // Check if already running
    checkAlreadyRunning();
    
    // Write PID file
    fs.writeFileSync(PIDFILE, process.pid.toString());
    
    // Setup logging
    if (fs.existsSync(LOGFILE)) {
        fs.copyFileSync(LOGFILE, PREV_LOGFILE);
    }
    
    logStream = fs.createWriteStream(LOGFILE);
    logStream.write('!!! =================================================================\n');
    logStream.write(`${getTimestamp()} SHOREMAN STARTED\n`);
    logStream.write('!!! =================================================================\n');
    
    // Load environment
    loadEnvFile();
    
    // Parse Procfile
    const commands = parseProcfile();
    
    if (commands.length === 0) {
        console.error('No commands found in Procfile');
        process.exit(1);
    }
    
    // Setup signal handlers
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', () => {
        if (fs.existsSync(PIDFILE)) {
            fs.unlinkSync(PIDFILE);
        }
    });
    
    // Start all commands
    commands.forEach((cmd, index) => {
        startCommand(cmd.name, cmd.command, index);
    });
}

// Show usage
if (process.argv.includes('--help')) {
    console.log('Usage: node dev.js [procfile|Procfile] [envfile|.env]');
    console.log('Run Procfiles using Node.js.');
    console.log();
    console.log('The dev.js script reads commands from [procfile] and starts up the');
    console.log('processes that it describes.');
    process.exit(0);
}

// Run
main();