import { env, loadEnvFile } from 'node:process'

import { defineConfig } from 'drizzle-kit'

try {
  loadEnvFile()
  loadEnvFile('./env.local')
}
// eslint-disable-next-line no-empty
catch {
  // noop
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
})
