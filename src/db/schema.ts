
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  username: text('username'),
  password: text('password')
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  groups: many(groupsTable),
}));

export const groupsTable = sqliteTable('groups', {
  id: integer('id').primaryKey(),
  name: text('name'),
  ownerId: integer('owner_id'),
  players: text('players'),
  game: text('game'),
  maxPlayers: integer('maxPlayers'),
  date: text('date') // added this

})

export const postsRelations = relations(groupsTable, ({ one }) => ({
  owner: one(usersTable, {
    fields: [groupsTable.ownerId],
    references: [usersTable.id],
  }),
}));

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertGroup = typeof groupsTable.$inferInsert;
export type SelectGroup = typeof groupsTable.$inferSelect;