#!/usr/bin/env node

import { checkCommand, checkEnvironmentVariable, checkGitHubAuth } from "./lib/checks.mjs";

const usage = `Usage: node check-requirements.mjs [options]

Check the local capabilities needed by pr-change-video without changing the system.

Options:
  --renderer <remotion|manim>  Check dependencies for an approved renderer
  --json                       Emit machine-readable JSON
  --help                       Show this help
`;

function parseArgs(args) {
  const options = { renderer: null, json: false };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help") return { help: true };
    if (arg === "--json") {
      options.json = true;
      continue;
    }
    if (arg === "--renderer") {
      options.renderer = args[index + 1];
      index += 1;
      if (!options.renderer) throw new Error("--renderer requires a value");
      continue;
    }
    throw new Error(`unknown option: ${arg}`);
  }

  if (options.renderer && !["remotion", "manim"].includes(options.renderer)) {
    throw new Error("--renderer must be remotion or manim");
  }

  return options;
}

function runChecks(renderer) {
  const checks = [
    checkCommand("node"),
    checkCommand("gh"),
    checkGitHubAuth(),
    checkCommand("ffmpeg"),
    checkCommand("ffprobe"),
    checkEnvironmentVariable("ELEVENLABS_API_KEY"),
  ];

  if (renderer === "remotion") {
    checks.push(checkCommand("npm"));
  } else if (renderer === "manim") {
    checks.push(checkCommand("python3"), checkCommand("manim"));
  }

  return checks;
}

function printText(report) {
  for (const check of report.checks) {
    const level = check.ok ? "PASS" : check.required ? "FAIL" : "WARN";
    process.stdout.write(`${level} ${check.name}: ${check.detail}\n`);
  }
  process.stdout.write(report.ok ? "READY requirements satisfied\n" : "BLOCKED required capabilities missing\n");
}

let options;
try {
  options = parseArgs(process.argv.slice(2));
} catch (error) {
  process.stderr.write(`${error.message}\n${usage}`);
  process.exit(2);
}

if (options.help) {
  process.stdout.write(usage);
  process.exit(0);
}

const checks = runChecks(options.renderer);
const report = {
  ok: checks.every((check) => check.ok || !check.required),
  renderer: options.renderer,
  checks,
};

if (options.json) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  printText(report);
}

process.exitCode = report.ok ? 0 : 1;
