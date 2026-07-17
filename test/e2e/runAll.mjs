import http from "node:http";
import { spawn } from "node:child_process";
import { runLandingNavigationFlow } from "./landingNavigation.e2e.mjs";
import { runSchoolsFlow } from "./schoolsFlow.e2e.mjs";
import { runHomesFlow } from "./homesFlow.e2e.mjs";
import { runSavedHomesFlow } from "./savedHomesFlow.e2e.mjs";
import { runHouseDetailFlow } from "./houseDetailFlow.e2e.mjs";

const BASE_URL = process.env.E2E_BASE_URL || "http://127.0.0.1:5173";
const SERVER_WAIT_MS = 60000;

function wait(delayMs) {
  return new Promise(resolve => setTimeout(resolve, delayMs));
}

function serverResponding(url) {
  return new Promise(resolve => {
    const request = http.get(url, response => {
      response.resume();
      resolve(response.statusCode >= 200 && response.statusCode < 500);
    });

    request.on("error", () => resolve(false));
    request.setTimeout(2000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await serverResponding(url)) {
      return;
    }
    await wait(500);
  }

  throw new Error(`Vite server did not respond at ${url} within ${timeoutMs}ms`);
}

function startViteServer() {
  const command = process.platform === "win32"
    ? "cmd.exe"
    : "npm";
  const args = process.platform === "win32"
    ? ["/d", "/s", "/c", "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort"]
    : ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5173", "--strictPort"];

  return spawn(command, args, {
    cwd: process.cwd(),
    stdio: "inherit"
  });
}

async function stopViteServer(child) {
  if (!child || child.killed) {
    return;
  }

  child.kill("SIGTERM");
  await wait(800);

  if (!child.killed) {
    child.kill("SIGKILL");
  }
}

async function runAllE2E() {
  const server = startViteServer();

  try {
    await waitForServer(BASE_URL, SERVER_WAIT_MS);

    const tests = [
      ["landing navigation", runLandingNavigationFlow],
      ["schools flow", runSchoolsFlow],
      ["homes flow", runHomesFlow],
      ["saved homes flow", runSavedHomesFlow],
      ["house detail flow", runHouseDetailFlow]
    ];

    for (const [name, runFlow] of tests) {
      process.stdout.write(`\n▶ Running ${name}...\n`);
      await runFlow(BASE_URL);
      process.stdout.write(`✅ ${name} passed\n`);
    }
  } finally {
    await stopViteServer(server);
  }
}

try {
  await runAllE2E();
  process.stdout.write("\n🎉 All Selenium E2E flows passed\n");
} catch (error) {
  process.stderr.write(`\n❌ Selenium E2E run failed: ${error.message}\n`);
  process.exitCode = 1;
}
