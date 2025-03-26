/**
 * Utility type to manually define table types since Encore doesn't support
 * the typeof with property access pattern used by Drizzle's $inferSelect
 */
export type TableType<T> = T; 