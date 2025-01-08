import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle } from "drizzle-orm/node-postgres";

const DB = new SQLDatabase("marital-connect", {
    migrations: {
        path: "migrations",
        source: "drizzle",
    },
});

export const db = drizzle(DB.connectionString);



