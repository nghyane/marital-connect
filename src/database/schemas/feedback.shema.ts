import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { appointments } from "./appointments.schema";
import { users } from "./users.schema";

export const feedback = pgTable("feedback", {
    id: serial().primaryKey(),
    appointment_id: integer().references(() => appointments.id),
    user_id: integer().references(() => users.id),
    rating: integer(),
    comment: text(),
});

export type Feedback = typeof feedback.$inferSelect;