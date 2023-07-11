import invariant from "tiny-invariant";

const requiredServerEnvs = [
  "NODE_ENV",
  "DATABASE_PATH",
  "DATABASE_URL",
  "SESSION_SECRET",
  "CACHE_DATABASE_PATH",
] as const;

export function init() {
  for (const env of requiredServerEnvs) {
    invariant(process.env[env], `${env} is required`);
  }
}

function getEnv() {
  return {
    FLY: process.env.FLY,
    NODE_ENV: process.env.NODE_ENV,
  };
}

type ENV = ReturnType<typeof getEnv>;

// App puts these on
declare global {
  // eslint-disable-next-line
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}

export { getEnv };
