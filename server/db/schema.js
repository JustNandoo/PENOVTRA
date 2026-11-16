import { relations, sql } from 'drizzle-orm'
import {
  boolean, index, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, uuid,
} from 'drizzle-orm/pg-core'

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow()

/* ── Accounts ─────────────────────────────────────────────────────────── */

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  passwordHash: text('password_hash'), // null for Google-only accounts
  googleId: text('google_id'),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  createdAt: createdAt(),
}, t => [
  uniqueIndex('users_email_key').on(sql`lower(${t.email})`),
  uniqueIndex('users_google_id_key').on(t.googleId),
])

// The cookie holds a random token; only its SHA-256 is stored here.
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: createdAt(),
}, t => [index('sessions_user_idx').on(t.userId)])

export const codePurpose = pgEnum('code_purpose', ['verify', 'login', 'reset'])

// 6-digit email codes (verify / login) and reset-link tokens, stored hashed.
export const emailCodes = pgTable('email_codes', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  purpose: codePurpose('purpose').notNull(),
  codeHash: text('code_hash').notNull(),
  attempts: integer('attempts').notNull().default(0),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: createdAt(),
}, t => [index('email_codes_lookup_idx').on(sql`lower(${t.email})`, t.purpose)])

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  recipient: text('recipient').notNull(),
  phone: text('phone').notNull(),
  line: text('line').notNull(),
  city: text('city').notNull(),
  province: text('province').notNull(),
  postalCode: text('postal_code').notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: createdAt(),
}, t => [index('addresses_user_idx').on(t.userId)])

/* ── Catalog ──────────────────────────────────────────────────────────── */

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  img: text('img').notNull(),
  sort: integer('sort').notNull().default(0),
})

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  short: text('short').notNull(),
  categoryId: text('category_id').notNull().references(() => categories.id),
  method: text('method').notNull(), // soil | hydro | both
  price: integer('price').notNull(), // rupiah
  unit: text('unit').notNull().default(''),
  tag: text('tag'),
  img: text('img').notNull(),
  gallery: jsonb('gallery').$type().notNull().default([]),
  blurb: text('blurb').notNull(),
  description: text('description').notNull(),
  specs: jsonb('specs').$type().notNull().default([]),
  box: jsonb('box').$type().notNull().default([]),
  stock: integer('stock').notNull().default(0),
  comingSoon: boolean('coming_soon').notNull().default(false),
  featured: boolean('featured').notNull().default(false),
  hasParts: boolean('has_parts').notNull().default(false),
  active: boolean('active').notNull().default(true),
  sort: integer('sort').notNull().default(0),
  createdAt: createdAt(),
}, t => [index('products_category_idx').on(t.categoryId)])

export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  code: text('code').notNull(), // std | plus
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  price: integer('price').notNull(),
  sort: integer('sort').notNull().default(0),
}, t => [uniqueIndex('product_variants_code_key').on(t.productId, t.code)])

// "Ingatkan saya" sign-ups for coming-soon products
export const productWaitlist = pgTable('product_waitlist', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  createdAt: createdAt(),
}, t => [uniqueIndex('product_waitlist_key').on(t.productId, sql`lower(${t.email})`)])

/* ── Orders ───────────────────────────────────────────────────────────── */

export const orderStatus = pgEnum('order_status', ['bayar', 'proses', 'kirim', 'selesai', 'batal'])

export const orders = pgTable('orders', {
  id: text('id').primaryKey(), // PNV-YYMM-XXXX
  userId: uuid('user_id').notNull().references(() => users.id),
  status: orderStatus('status').notNull().default('bayar'),
  subtotal: integer('subtotal').notNull(),
  shippingMethod: text('shipping_method').notNull(),
  shippingCost: integer('shipping_cost').notNull(),
  insurance: integer('insurance').notNull().default(0),
  total: integer('total').notNull(),
  payMethod: text('pay_method').notNull(), // va | qris | wallet | card
  payChannel: text('pay_channel'), // BCA, GoPay, ...
  payCode: text('pay_code'), // VA number / QR payload from the gateway
  payExpiresAt: timestamp('pay_expires_at', { withTimezone: true }).notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  address: jsonb('address').$type().notNull(), // snapshot at checkout
  courierNote: text('courier_note'),
  resi: text('resi'),
  eta: text('eta'),
  createdAt: createdAt(),
}, t => [index('orders_user_idx').on(t.userId, t.createdAt)])

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id),
  variantId: integer('variant_id').references(() => productVariants.id),
  // snapshots so old orders keep their original names and prices
  name: text('name').notNull(),
  variantName: text('variant_name'),
  img: text('img').notNull(),
  price: integer('price').notNull(),
  qty: integer('qty').notNull(),
}, t => [index('order_items_order_idx').on(t.orderId)])

export const orderEvents = pgTable('order_events', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  place: text('place').notNull().default(''),
  at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('order_events_order_idx').on(t.orderId, t.at)])

/* ── Relations (for db.query.* with `with`) ───────────────────────────── */

export const productsRelations = relations(products, ({ many, one }) => ({
  variants: many(productVariants),
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
}))
export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
}))
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
  events: many(orderEvents),
}))
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}))
export const orderEventsRelations = relations(orderEvents, ({ one }) => ({
  order: one(orders, { fields: [orderEvents.orderId], references: [orders.id] }),
}))
