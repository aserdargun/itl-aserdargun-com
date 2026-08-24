import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflowPath = ".github/workflows/deploy-swa-itl-aserdargun-com.yml";
const releaseEvidencePath = "docs/validation/production-release.md";

const readRequiredFile = (path: string) => {
  expect(existsSync(path), `${path} must exist`).toBe(true);
  return readFileSync(path, "utf8");
};

describe("production deployment workflow", () => {
  it("has the sole production trigger, least privilege, and serialized concurrency", () => {
    const workflow = readRequiredFile(workflowPath);

    expect(workflow).toMatch(
      /on:\n  push:\n    branches:\n      - main\n  workflow_dispatch:/,
    );
    expect(workflow).not.toMatch(
      /pull_request:|schedule:|repository_dispatch:/,
    );
    expect(workflow).toMatch(/permissions:\n  contents: read/);
    expect(workflow).not.toMatch(/id-token:|actions: write|contents: write/);
    expect(workflow).toMatch(
      /concurrency:\n  group: swa-itl-aserdargun-com-production\n  cancel-in-progress: false/,
    );
  });

  it("pins every official action to the reviewed immutable commit", () => {
    const workflow = readRequiredFile(workflowPath);
    const uses = workflow
      .split("\n")
      .filter((line) => line.trimStart().startsWith("uses:"));

    expect(uses).toEqual([
      "        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1",
      "        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0",
      "        uses: Azure/static-web-apps-deploy@1a947af9992250f3bc2e68ad0754c0b0c11566c9 # v1",
    ]);
  });

  it("validates and asserts the complete prebuilt artifact before upload", () => {
    const workflow = readRequiredFile(workflowPath);
    const install = workflow.indexOf("run: npm ci");
    const validate = workflow.indexOf("run: npm run validate:codex");
    const artifact = workflow.indexOf("name: Assert prebuilt static artifact");
    const deploy = workflow.indexOf("name: Deploy prebuilt static artifact");

    expect(install).toBeGreaterThan(-1);
    expect(validate).toBeGreaterThan(install);
    expect(artifact).toBeGreaterThan(validate);
    expect(deploy).toBeGreaterThan(artifact);
    for (const assertion of [
      "test -d out",
      "test -s out/index.html",
      "test -s out/404.html",
      "test -d out/_next/static",
      "test -s out/staticwebapp.config.json",
      'readFileSync("out/staticwebapp.config.json", "utf8")',
    ]) {
      expect(workflow).toContain(assertion);
    }
  });

  it("deploys only out through the one derived secret without source integration", () => {
    const workflow = readRequiredFile(workflowPath);

    expect(workflow).toContain("action: upload");
    expect(workflow).toContain("app_location: out");
    expect(workflow).toContain("skip_app_build: true");
    expect(workflow).toContain('output_location: ""');
    expect(workflow).toContain(
      "azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_ITL_ASERDARGUN_COM }}",
    );
    expect(
      workflow.match(/AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_ITL_ASERDARGUN_COM/g),
    ).toHaveLength(1);
    expect(workflow).not.toMatch(
      /github_id_token|repo_token|github_token|deployment_token|source_repository|github\.token/,
    );
  });

  it("is the only Azure Static Web Apps deployment workflow", () => {
    const deploymentWorkflows = readdirSync(".github/workflows")
      .filter((file) => /\.ya?ml$/.test(file))
      .filter((file) =>
        readFileSync(`.github/workflows/${file}`, "utf8").includes(
          "Azure/static-web-apps-deploy@",
        ),
      );

    expect(deploymentWorkflows).toEqual(["deploy-swa-itl-aserdargun-com.yml"]);
  });
});

describe("production release evidence template", () => {
  it("starts pending and covers every terminal release surface", () => {
    const evidence = readRequiredFile(releaseEvidencePath);

    expect(evidence).toContain("Status: PENDING");
    expect(evidence).toContain("No live production value has been recorded");
    for (const field of [
      "UTC timestamp",
      "Release SHA",
      "Workflow URL",
      "Workflow conclusion",
      "rg-itl-aserdargun-com",
      "swa-itl-aserdargun-com",
      "westeurope",
      "Free",
      "Generated hostname",
      "Provisioning state",
      "Production environment status",
      "Custom domains",
      "Authoritative nameservers",
      "_dnsauth.itl.aserdargun.com",
      "itl.aserdargun.com",
      "TLS subject",
      "TLS SAN",
      "Security headers",
      "Browser routes exercised",
      "Production-targeted tests",
      "Local Stop",
      "Port 4173 listener",
    ]) {
      expect(evidence).toContain(field);
    }
    expect(evidence).not.toMatch(/azurestaticapps\.net/);
  });
});
