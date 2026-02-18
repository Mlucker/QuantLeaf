
import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.STORAGE_POSTGRES_URL) {
    throw new Error('STORAGE_POSTGRES_URL environment variable is not set');
}

export default defineConfig({
    schema: './lib/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.STORAGE_POSTGRES_URL,
    },
});
