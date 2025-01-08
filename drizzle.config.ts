import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: 'src/database/migrations',
    schema: 'src/database/schemas',
    dialect: 'postgresql',
});