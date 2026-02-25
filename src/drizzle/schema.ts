import { pgTable, uuid, varchar, timestamp, numeric, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/* ==============================
   ENUMS
============================== */

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'DEALER']);

export const auctionStatusEnum = pgEnum('auction_status', ['PENDING', 'ACTIVE', 'CLOSED']);

/* ==============================
   USERS TABLE
============================== */

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: userRoleEnum('role').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('users_email_unique').on(table.email)],
);

/* ==============================
   AUCTIONS TABLE
============================== */

export const auctions = pgTable(
  'auctions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    startPrice: numeric('start_price', {
      precision: 12,
      scale: 2,
    }).notNull(),
    currentPrice: numeric('current_price', {
      precision: 12,
      scale: 2,
    }).notNull(),
    status: auctionStatusEnum('status').default('PENDING').notNull(),
    startTime: timestamp('start_time'),
    endTime: timestamp('end_time'),
    createdBy: uuid('created_by')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('auction_status_idx').on(table.status)],
);

/* ==============================
   BIDS TABLE
============================== */

export const bids = pgTable(
  'bids',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    auctionId: uuid('auction_id')
      .references(() => auctions.id, { onDelete: 'cascade' })
      .notNull(),
    dealerId: uuid('dealer_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    amount: numeric('amount', {
      precision: 12,
      scale: 2,
    }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('bids_auction_idx').on(table.auctionId),
    index('bids_dealer_idx').on(table.dealerId),
  ],
);

/* ==============================
   RELATIONS
============================== */

export const usersRelations = relations(users, ({ many }) => ({
  bids: many(bids),
  auctions: many(auctions),
}));

export const auctionsRelations = relations(auctions, ({ many, one }) => ({
  bids: many(bids),
  creator: one(users, {
    fields: [auctions.createdBy],
    references: [users.id],
  }),
}));

export const bidsRelations = relations(bids, ({ one }) => ({
  auction: one(auctions, {
    fields: [bids.auctionId],
    references: [auctions.id],
  }),
  dealer: one(users, {
    fields: [bids.dealerId],
    references: [users.id],
  }),
}));
