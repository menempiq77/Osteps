import path from "path";
import fs from "fs";

const findProjectRoot = (startFrom: string): string => {
  let current = path.resolve(startFrom);
  const root = path.parse(current).root;

  while (current !== root) {
    try {
      const packagePath = path.join(current, "package.json");
      if (fs.existsSync(packagePath)) {
        const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
        if (pkg?.dependencies?.next || pkg?.devDependencies?.next) {
          return current;
        }
      }
    } catch {
      // ignore unreadable package.json
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return path.resolve(process.cwd());
};

const projectRoot = findProjectRoot(process.cwd());

const envDataDir = process.env.OSTEPS_DATA_DIR
  ? path.resolve(process.env.OSTEPS_DATA_DIR)
  : undefined;

/**
 * Absolute path to the persistent `.data` directory.
 *
 * Uses `OSTEPS_DATA_DIR` env var when set (recommended for production),
 * otherwise resolves to `<project-root>/.data` so the directory does not
 * drift when PM2/Node is started from a different working directory.
 */
export const DATA_DIR: string = envDataDir ?? path.join(projectRoot, ".data");

// Candidate directories that may contain legacy data from earlier deployments
// where the working directory or DATA_DIR value was different. Read paths can
// fall back to these to recover student answers/marking that appear "empty"
// after a deploy.
const rawLegacyCandidates = [
  path.join(projectRoot, "..", ".data"),
  path.join(process.cwd(), ".data"),
];

if (envDataDir) {
  rawLegacyCandidates.push(path.join(projectRoot, ".data"));
}

const resolvedPrimary = path.resolve(DATA_DIR);

/**
 * Additional `.data` directories to check when a stored state is not found in
 * `DATA_DIR`.
 */
export const LEGACY_DATA_DIRS: string[] = Array.from(
  new Set(
    rawLegacyCandidates
      .map((dir) => path.resolve(dir))
      .filter((dir) => dir !== resolvedPrimary)
  )
);
