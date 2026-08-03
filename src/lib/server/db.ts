import mysql from "mysql2/promise";

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (value) return value;
  if (fallback) return fallback;
  throw new Error(`Missing environment variable: ${key}`);
};

const parseConnectionUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ""),
    };
  } catch {
    return null;
  }
};

const createPoolConfig = () => {
  const mysqlUrl = process.env.OSTEPS_MYSQL_URL;
  if (mysqlUrl) {
    const parsed = parseConnectionUrl(mysqlUrl);
    if (parsed) return parsed;
  }

  return {
    host: getEnv("OSTEPS_MYSQL_HOST", "127.0.0.1"),
    port: Number(getEnv("OSTEPS_MYSQL_PORT", "3306")),
    user: getEnv("OSTEPS_MYSQL_USER"),
    password: getEnv("OSTEPS_MYSQL_PASSWORD"),
    database: getEnv("OSTEPS_MYSQL_DATABASE"),
  };
};

let pool: mysql.Pool | null = null;

export const getDbPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool({
      ...createPoolConfig(),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

export const ensureDbConnection = async () => {
  try {
    const connection = await getDbPool().getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error("MySQL connection check failed:", error);
    return false;
  }
};
