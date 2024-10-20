import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  username: text('username'),
  password: text('password'),
  usernameToken: text('username_token'),
});

export const groupsTable = sqliteTable('groups', {
  id: integer('id').primaryKey(),
  name: text('name'),
  ownerId: integer('owner_id').references(() => usersTable.id, {onDelete: 'cascade'}),
  game: text('game'),
  maxPlayers: integer('max_players'),
  date: text('date'),
})

export const usersToGroups = sqliteTable("users_to_groups", {
  squadId: integer("squad_id").notNull().references(() => groupsTable.id, {onDelete: "cascade"}),
  userId: integer("user_id").notNull().references(() => usersTable.id, {onDelete: "cascade"})
})

export const usersRelations = relations(usersTable, ({ many }) => ({
  groups: many(groupsTable),
  usersToGroups: many(usersToGroups),
}));

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groupsTable, {
    fields: [usersToGroups.squadId],
    references: [groupsTable.id],
  }),
  user: one(usersTable, {
    fields: [usersToGroups.userId],
    references: [usersTable.id],
  }),
}));

export const groupsRelations = relations(groupsTable, ({ one, many }) => ({
  owner: one(usersTable, {
    fields: [groupsTable.ownerId],
    references: [usersTable.id],
  }),
  usersToGroups: many(usersToGroups),
}));

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertGroup = typeof groupsTable.$inferInsert;
export type SelectGroup = typeof groupsTable.$inferSelect;

