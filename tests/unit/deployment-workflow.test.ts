import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseDocument } from "yaml";

const workflowPath = ".github/workflows/deploy-swa-itl-aserdargun-com.yml";
const releaseEvidencePath = "docs/validation/production-release.md";

const checkoutSha = "3d3c42e5aac5ba805825da76410c181273ba90b1";
const setupNodeSha = "820762786026740c76f36085b0efc47a31fe5020";
const staticWebAppsDeploySha = "1a947af9992250f3bc2e68ad0754c0b0c11566c9";
const deploymentSecretExpression =
  "${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_ITL_ASERDARGUN_COM }}";

const artifactAssertionScript = `set -euo pipefail
test -d out
test -s out/index.html
test -s out/404.html
test -d out/_next/static
test -n "$(find out/_next/static -type f -print -quit)"
test -s out/staticwebapp.config.json
node --input-type=module <<'NODE'
import { readFileSync } from "node:fs";

const config = JSON.parse(
  readFileSync("out/staticwebapp.config.json", "utf8"),
);

if (!Array.isArray(config.routes) || config.routes.length === 0) {
  throw new Error("out/staticwebapp.config.json has no routes.");
}

if (!config.globalHeaders?.["Content-Security-Policy"]) {
  throw new Error(
    "out/staticwebapp.config.json has no Content-Security-Policy.",
  );
}
NODE
`;

const expectedWorkflow = {
  name: "Deploy Industrial Twin Lab to Azure Static Web Apps",
  on: {
    push: {
      branches: ["main"],
    },
    workflow_dispatch: null,
  },
  permissions: {
    contents: "read",
  },
  concurrency: {
    group: "swa-itl-aserdargun-com-production",
    "cancel-in-progress": false,
  },
  jobs: {
    deploy: {
      name: "Validate, build, and deploy",
      "runs-on": "ubuntu-latest",
      steps: [
        {
          name: "Check out the release commit",
          uses: `actions/checkout@${checkoutSha}`,
          with: {
            "persist-credentials": false,
          },
        },
        {
          name: "Set up Node.js",
          uses: `actions/setup-node@${setupNodeSha}`,
          with: {
            "node-version": 22,
            cache: "npm",
            "cache-dependency-path": "package-lock.json",
          },
        },
        {
          name: "Install locked dependencies",
          run: "npm ci",
        },
        {
          name: "Validate and build the release",
          run: "npm run validate:codex",
        },
        {
          name: "Assert prebuilt static artifact",
          shell: "bash",
          run: artifactAssertionScript,
        },
        {
          name: "Deploy prebuilt static artifact",
          uses: `Azure/static-web-apps-deploy@${staticWebAppsDeploySha}`,
          with: {
            azure_static_web_apps_api_token: deploymentSecretExpression,
            action: "upload",
            app_location: "out",
            skip_app_build: true,
            output_location: "",
          },
        },
      ],
    },
  },
};

const expectedReleaseEvidence = {
  "UTC timestamp": "PENDING",
  "Local validation UTC timestamp": "PENDING",
  "Release SHA": "PENDING",
  "Source branch": "Intended: `main`; observed: PENDING",
  "Workflow file": "`.github/workflows/deploy-swa-itl-aserdargun-com.yml`",
  "Workflow URL": "PENDING",
  "Workflow conclusion": "PENDING",
  "Deploy step conclusion": "PENDING",
  Subscription: "Intended: `aserdargun subscription`; observed: PENDING",
  "Tenant/account": "PENDING",
  "Resource group": "Intended: `rg-itl-aserdargun-com`; observed: PENDING",
  "Static Web App": "Intended: `swa-itl-aserdargun-com`; observed: PENDING",
  Location: "Intended: `westeurope`; observed: PENDING",
  SKU: "Intended: `Free`; observed: PENDING",
  "Generated hostname": "PENDING",
  "Provisioning state": "PENDING",
  "Production environment status": "PENDING",
  "Production branch and exposed commit identity": "PENDING",
  "Environment update UTC timestamp": "PENDING",
  "Custom domains": "PENDING",
  "DNS query UTC timestamp": "PENDING",
  "Authoritative nameservers": "PENDING",
  "Ownership owner":
    "Intended: `_dnsauth.itl.aserdargun.com`; observed: PENDING",
  "Ownership TXT answer on every authority": "PENDING",
  "Custom-domain owner": "Intended: `itl.aserdargun.com`; observed: PENDING",
  "CNAME target on every authority": "PENDING",
  "Public recursive TXT answers": "PENDING",
  "Public recursive CNAME answers": "PENDING",
  "Azure custom-domain status": "PENDING",
  "Verification UTC timestamp": "PENDING",
  "TLS subject": "PENDING",
  "TLS SAN": "PENDING",
  "TLS verification result": "PENDING",
  "Generated-hostname HTTP status and content marker": "PENDING",
  "Custom-domain homepage HTTP status and content marker": "PENDING",
  "Custom-domain deep-route HTTP status and content marker": "PENDING",
  "Security headers": "PENDING",
  "Representative asset status and content type": "PENDING",
  "Browser verification UTC timestamp": "PENDING",
  "Browser routes exercised": "PENDING",
  "Homepage identity and primary interaction": "PENDING",
  "Mobile navigation": "PENDING",
  "Architecture publication": "PENDING",
  "Experiment demonstrator state change": "PENDING",
  "Relevant browser console errors or warnings": "PENDING",
  "Desktop and mobile overflow": "PENDING",
  "Production-targeted tests": "PENDING",
  "Local Stop command": "`npm run stop:codex`",
  "Local Stop UTC timestamp and result": "PENDING",
  "Port 4173 listener": "PENDING",
};

const readRequiredFile = (path: string) => {
  expect(existsSync(path), `${path} must exist`).toBe(true);
  return readFileSync(path, "utf8");
};

const parseYaml = (source: string) => {
  const document = parseDocument(source, {
    prettyErrors: true,
    schema: "core",
    uniqueKeys: true,
  });

  expect(document.errors.map((error) => error.message)).toEqual([]);
  return document.toJS() as unknown;
};

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
};

const parseEvidenceRows = (markdown: string) => {
  const entries = markdown
    .split("\n")
    .map((line) => line.match(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => [match[1].trim(), match[2].trim()] as const)
    .filter(
      ([field, evidence]) =>
        field !== "Field" &&
        !/^[-:]+$/.test(field) &&
        !/^[-:]+$/.test(evidence),
    );

  expect(new Set(entries.map(([field]) => field)).size).toBe(entries.length);
  return Object.fromEntries(entries);
};

describe("production deployment workflow", () => {
  it("matches the complete reviewed YAML contract", () => {
    const workflow = parseYaml(readRequiredFile(workflowPath));

    expect(workflow).toEqual(expectedWorkflow);
  });

  it("contains only the reviewed deployment secret expression", () => {
    const workflow = parseYaml(readRequiredFile(workflowPath));
    const secretExpressions = collectStrings(workflow).flatMap((value) =>
      [...value.matchAll(/\$\{\{\s*secrets\.[A-Za-z0-9_]+\s*\}\}/g)].map(
        ([expression]) => expression,
      ),
    );

    expect(secretExpressions).toEqual([deploymentSecretExpression]);
  });

  it("is the only parsed workflow that deploys to Azure Static Web Apps", () => {
    const deploymentWorkflows = readdirSync(".github/workflows")
      .filter((file) => /\.ya?ml$/.test(file))
      .filter((file) => {
        const workflow = parseYaml(
          readFileSync(`.github/workflows/${file}`, "utf8"),
        );
        return collectStrings(workflow).some((value) =>
          value.startsWith("Azure/static-web-apps-deploy@"),
        );
      });

    expect(deploymentWorkflows).toEqual(["deploy-swa-itl-aserdargun-com.yml"]);
  });
});

describe("production release evidence template", () => {
  it("keeps every initial observation pending and only intended constants populated", () => {
    const evidence = readRequiredFile(releaseEvidencePath);
    const status = evidence.match(/^Status:\s*(.+)$/m)?.[1];

    expect(status).toBe("PENDING");
    expect(parseEvidenceRows(evidence)).toEqual(expectedReleaseEvidence);
  });
});
