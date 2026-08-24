import { execFileSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const expectedPort = "4173";
const requestedPort = process.argv[2];

if (requestedPort !== expectedPort || process.argv.length !== 3) {
  console.error(`This project can only stop port ${expectedPort}.`);
  process.exitCode = 1;
} else {
  const repositoryRoot = realpathSync(
    resolve(dirname(fileURLToPath(import.meta.url)), ".."),
  );
  const listenerPids = listListenerPids(expectedPort);
  const verifiedPids = listenerPids.filter((pid) =>
    isProjectListener(pid, repositoryRoot),
  );

  if (listenerPids.length !== verifiedPids.length) {
    process.exitCode = 1;
  }

  for (const pid of verifiedPids) {
    process.kill(pid, "SIGTERM");
  }

  await waitForTermination(verifiedPids);
}

function listListenerPids(port) {
  try {
    return execFileSync("lsof", [`-tiTCP:${port}`, "-sTCP:LISTEN"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .map((pid) => pid.trim())
      .filter(Boolean)
      .map(Number)
      .filter(Number.isSafeInteger);
  } catch {
    return [];
  }
}

function isProjectListener(pid, repositoryRoot) {
  try {
    const output = execFileSync(
      "lsof",
      ["-a", "-p", String(pid), "-d", "cwd", "-Fn"],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
    const cwd = output
      .split("\n")
      .find((line) => line.startsWith("n"))
      ?.slice(1);

    if (!cwd || realpathSync(cwd) !== repositoryRoot) {
      console.error(
        `Refusing to stop listener ${pid}: it is not owned by this repository.`,
      );
      return false;
    }

    return true;
  } catch {
    console.error(
      `Refusing to stop listener ${pid}: its working directory could not be verified.`,
    );
    return false;
  }
}

async function waitForTermination(pids) {
  const deadline = Date.now() + 5_000;
  let remaining = pids.filter(isRunning);

  while (remaining.length > 0 && Date.now() < deadline) {
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
    remaining = remaining.filter(isRunning);
  }

  for (const pid of remaining) {
    process.kill(pid, "SIGKILL");
  }
}

function isRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
