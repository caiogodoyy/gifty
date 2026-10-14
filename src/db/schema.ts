import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

const now = () => new Date();

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  shirtSize: text("shirt_size"),
  pantsSize: text("pants_size"),
  shoeSize: text("shoe_size"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
});

export const groups = sqliteTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  ownerId: text("owner_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
});

export const groupMembers = sqliteTable(
  "group_members",
  {
    groupId: text("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    joinedAt: integer("joined_at", { mode: "timestamp" }).notNull().$defaultFn(now),
  },
  (t) => ({ pk: primaryKey({ columns: [t.groupId, t.userId] }) }),
);

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  url: text("url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
});

// Uma reserva por item (itemId é PK). Nunca consultada nas telas do dono do item.
export const reservations = sqliteTable("reservations", {
  itemId: text("item_id").primaryKey().references(() => items.id, { onDelete: "cascade" }),
  reservedBy: text("reserved_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
});

export const MAX_GROUPS = 3;
