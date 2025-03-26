import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schemas from "./schemas/index"

const database = new SQLDatabase("marital-connect", {
    migrations: {
        path: "migrations",
        source: "drizzle",
    },
});

export const db = drizzle(database.connectionString, {
    schema: {
        ...schemas
    }
});



