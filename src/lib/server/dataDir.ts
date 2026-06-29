import path from "path";

/**
 * Absolute path to the persistent `.data` directory.
 *
 * Uses `OSTEPS_DATA_DIR` env var when set (recommended for production),
 * otherwise falls back to `<cwd>/.data`.
 *
 * A single source of truth prevents data loss when the working directory
 * changes between deployments.
 */
export const DATA_DIR: string = process.env.OSTEPS_DATA_DIR
  ? path.resolve(process.env.OSTEPS_DATA_DIR)
  : path.join(process.cwd(), ".data");
