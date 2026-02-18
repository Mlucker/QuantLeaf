
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.STORAGE_POSTGRES_URL) {
    console.warn('STORAGE_POSTGRES_URL environment variable is not set. Database connection will fail if attempted.');
}

const client = postgres(process.env.STORAGE_POSTGRES_URL || 'postgres://placeholder:placeholder@localhost:5432/placeholder');
export const db = drizzle(client);
