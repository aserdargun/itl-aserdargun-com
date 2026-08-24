import { pathToFileURL } from "node:url";

import {
  CONTENT_REGISTRY,
  validateContentEntries,
} from "@/lib/content/registry";
import type { ContentEntry } from "@/lib/content/types";

type WriteLine = (line: string) => void;

export const runContentValidation = (
  entries: readonly ContentEntry[] = CONTENT_REGISTRY,
  writeLine: WriteLine = console.log,
): 0 | 1 => {
  const errors = validateContentEntries(entries);

  if (errors.length > 0) {
    writeLine(`Content validation failed with ${errors.length} error(s):`);
    for (const error of errors) writeLine(`- ${error}`);
    return 1;
  }

  writeLine(`Content validation passed: ${entries.length} entries valid.`);
  return 0;
};

const isMainModule =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) process.exitCode = runContentValidation();
