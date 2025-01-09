import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle } from "drizzle-orm/node-postgres";

import * as users from "./schemas/users.schema";
import * as roles from "./schemas/roles.schema";


const DB = new SQLDatabase("marital-connect", {
    migrations: {
        path: "migrations",
        source: "drizzle",
    },
});

export const db = drizzle(DB.connectionString, {
    schema: {
        ...users,
        ...roles,
    }
});



