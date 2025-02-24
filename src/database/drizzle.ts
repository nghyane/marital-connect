import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle } from "drizzle-orm/node-postgres";

import * as users from "./schemas/users.schema";
import * as roles from "./schemas/roles.schema";
import * as blogPosts from "./schemas/blog-posts.schema";
import * as experts from "./schemas/experts.schema";
import * as expertEducation from "./schemas/expert-education.schema";
import * as expertCertifications from "./schemas/expert-certifications.schema";
import * as expertServices from "./schemas/expert-services.schema";


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
        ...blogPosts,
        ...experts,
        ...expertEducation,
        ...expertCertifications,
        ...expertServices,
    }
});



