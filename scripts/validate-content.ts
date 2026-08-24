import { pathToFileURL } from "node:url";

import {
  CONTENT_REGISTRY,
  validateContentEntries,
} from "../lib/content/registry.ts";
import type { ContentEntry } from "../lib/content/types.ts";
import {
  validatePublicationModules,
  type PublicationValidationOptions,
} from "../lib/content/validate-publications.ts";

type WriteLine = (line: string) => void;

export interface RunContentValidationOptions {
  readonly entries?: readonly ContentEntry[];
  readonly publicationValidation?: PublicationValidationOptions;
  readonly writeLine?: WriteLine;
}

export const runContentValidation = async (
  options: RunContentValidationOptions = {},
): Promise<0 | 1> => {
  const entries = options.entries ?? CONTENT_REGISTRY;
  const writeLine = options.writeLine ?? console.log;
  const errors = [
    ...validateContentEntries(entries),
    ...(await validatePublicationModules(options.publicationValidation)),
  ];

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

if (isMainModule) process.exitCode = await runContentValidation();
