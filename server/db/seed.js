import { sql as dsql } from 'drizzle-orm'
import { CATEGORIES, PRODUCTS } from './catalog-data.js'
import { categories, db, products, productVariants, sql } from './index.js'

/* Loads the starting catalog from catalog-data.js. Safe to run again: rows
   are upserted by id / slug, stock already in the database is kept. */

const STOCK = { 'pe-novtra-2-in-1': 25, 'pe-novtra-indoor-box': 0 }

await db.transaction(async tx => {
  for (const [i, c] of CATEGORIES.entries()) {
    await tx.insert(categories).values({ id: c.id, label: c.label, img: c.img, sort: i })
      .onConflictDoUpdate({ target: categories.id, set: { label: c.label, img: c.img, sort: i } })
  }

  for (const [i, p] of PRODUCTS.entries()) {
    const row = {
      slug: p.slug,
      name: p.name,
      short: p.short,
      categoryId: p.cat,
      method: p.method,
      price: p.price,
      unit: p.unit ?? '',
      tag: p.tag ?? null,
      img: p.img,
      gallery: p.gallery ?? [p.img],
      blurb: p.blurb,
      description: p.desc,
      specs: p.specs ?? [],
      box: p.box ?? [],
      stock: STOCK[p.slug] ?? 200,
      comingSoon: !!p.soon,
      featured: !!p.featured,
      hasParts: !!p.hasParts,
      sort: i,
    }
    const [saved] = await tx.insert(products).values(row)
      .onConflictDoUpdate({ target: products.slug, set: { ...row, stock: dsql`${products.stock}` } })
      .returning({ id: products.id })

    for (const [j, v] of (p.variants ?? []).entries()) {
      const vrow = { productId: saved.id, code: v.id, name: v.name, description: v.desc ?? '', price: v.price, sort: j }
      await tx.insert(productVariants).values(vrow)
        .onConflictDoUpdate({ target: [productVariants.productId, productVariants.code], set: vrow })
    }
  }
})

const [{ n }] = await sql`select count(*)::int as n from products`
console.log(`Seed selesai: ${CATEGORIES.length} kategori, ${n} produk.`)
await sql.end()
