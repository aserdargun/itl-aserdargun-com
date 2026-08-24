import { defineConfig, globalIgnores } from "eslint/config";
import nextTypeScript from "eslint-config-next/typescript";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".worktrees/**",
    ".next/**",
    "node_modules/**",
    "out/**",
    "playwright-report/**",
  ]),
]);
