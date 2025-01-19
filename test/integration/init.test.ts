import { describe, it, beforeEach, afterEach, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { readFile, rm, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join } from "pathe";

const cliPath = resolve(__dirname, "../../dist/cli.mjs");
const FIXTURE_DIR = resolve(__dirname, "../fixtures/init-test");
const CODEFETCH_DIR = join(FIXTURE_DIR, "codefetch");

describe("Integration: init command", () => {
  beforeEach(async () => {
    // if (existsSync(CODEFETCH_DIR)) {
    //   await rm(CODEFETCH_DIR, { recursive: true, force: true });
    // }
    // if (existsSync(join(FIXTURE_DIR, ".codefetchignore"))) {
    //   await unlink(join(FIXTURE_DIR, ".codefetchignore"));
    // }
    // if (existsSync(join(FIXTURE_DIR, "codefetch.config.mjs"))) {
    //   await unlink(join(FIXTURE_DIR, "codefetch.config.mjs"));
    // }
  });

  afterEach(async () => {
    // if (existsSync(CODEFETCH_DIR)) {
    //   await rm(CODEFETCH_DIR, { recursive: true, force: true });
    // }
    // if (existsSync(join(FIXTURE_DIR, ".codefetchignore"))) {
    //   await unlink(join(FIXTURE_DIR, ".codefetchignore"));
    // }
    // if (existsSync(join(FIXTURE_DIR, "codefetch.config.mjs"))) {
    //   await unlink(join(FIXTURE_DIR, "codefetch.config.mjs"));
    // }
  });

  it("creates default configuration", async () => {
    const result = spawnSync("node", [cliPath, "init"], {
      cwd: FIXTURE_DIR,
      encoding: "utf8",
      input: "1\n",
      stdio: ["pipe", "pipe", "pipe"],
    });

    console.log(result);

    expect(result.stderr).toBe("");
    expect(existsSync(join(FIXTURE_DIR, "codefetch.config.mjs"))).toBe(true);
    expect(existsSync(join(FIXTURE_DIR, ".codefetchignore"))).toBe(true);

    const configContent = await readFile(
      join(FIXTURE_DIR, "codefetch.config.mjs"),
      "utf8"
    );
    expect(configContent).toContain("outputPath");
    expect(configContent).toContain("tokenEncoder");
  });

  it("creates custom configuration", async () => {
    const result = spawnSync("node", [cliPath, "init"], {
      cwd: FIXTURE_DIR,
      encoding: "utf8",
      input: "custom\n.ts,.js\ncl100k\ngpt-4,claude-3\n", // Simulate user input
      stdio: ["pipe", "pipe", "pipe"],
    });

    expect(result.stderr).toBe("");
    expect(existsSync(join(FIXTURE_DIR, "codefetch.config.mjs"))).toBe(true);

    const configContent = await readFile(
      join(FIXTURE_DIR, "codefetch.config.mjs"),
      "utf8"
    );
    expect(configContent).toContain(".ts");
    expect(configContent).toContain(".js");
    expect(configContent).toContain("cl100k");
    expect(configContent).toContain("gpt-4");
  });

  it("creates default.md in prompts directory", async () => {
    const result = spawnSync("node", [cliPath, "init"], {
      cwd: FIXTURE_DIR,
      encoding: "utf8",
      input: "default\n",
      stdio: ["pipe", "pipe", "pipe"],
    });

    expect(result.stderr).toBe("");
    expect(existsSync(join(CODEFETCH_DIR, "prompts/default.md"))).toBe(true);

    const promptContent = await readFile(
      join(CODEFETCH_DIR, "prompts/default.md"),
      "utf8"
    );
    expect(promptContent).toContain("{{CURRENT_CODEBASE}}");
  });
});
