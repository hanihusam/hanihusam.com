import { type Config } from "@react-router/dev/config";

export default {
  ssr: true,
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
    // v8_viteEnvironmentApi requires Vite 7+, enabled in the Vite 8 phase
  },
} satisfies Config;
