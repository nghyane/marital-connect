import { integer, pgTable, serial, timestamp, text } from "drizzle-orm/pg-core";

import { experts } from "./experts.schema";
import { users } from "./users.schema";

export const appointments = pgTable("appointments", {
    id: serial().primaryKey(),
    expert_id: integer().references(() => experts.id),
    user_id: integer().references(() => users.id),
    scheduled_time: timestamp(),
    status: text(),
});

export type Appointment = typeof appointments.$inferSelect;

