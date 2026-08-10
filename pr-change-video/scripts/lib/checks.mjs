import { spawnSync } from "node:child_process";

export function checkCommand(name, { args = ["--version"], required = true } = {}) {
  const result = spawnSync(name, args, {
    encoding: "utf8",
    shell: false,
    timeout: 10_000,
  });

  if (result.error?.code === "ENOENT") {
    return { name, required, ok: false, detail: "not found on PATH" };
  }

  if (result.error) {
    return { name, required, ok: false, detail: result.error.message };
  }

  const lines = `${result.stdout ?? ""}\n${result.stderr ?? ""}`
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const output = result.status === 0 ? lines[0] : lines.join("; ");

  return {
    name,
    required,
    ok: result.status === 0,
    detail: output || `exited with status ${result.status}`,
  };
}

export function checkGitHubAuth() {
  const result = checkCommand("gh", { args: ["auth", "status"] });
  return { ...result, name: "gh-auth" };
}

export function checkEnvironmentVariable(name, { required = true } = {}) {
  const present = typeof process.env[name] === "string" && process.env[name].trim().length > 0;
  return {
    name,
    required,
    ok: present,
    detail: present ? "set" : "not set or empty",
  };
}
