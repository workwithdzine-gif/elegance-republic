// One-time (re-runnable) script that populates MongoDB with the same category
// tree and product catalog the frontend demo previously generated in-browser.
// Run with: npm run seed  (from the server/ folder)
//
// Safe to re-run — categories and products are upserted by slug, so running
// this twice won't create duplicates.

import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

// ---------------------------------------------------------------------------
// 1. Category tree — mirrors frontend/src/data/categories.js
// ---------------------------------------------------------------------------
const child = (name, slug, description) => ({ name, slug, description, children: [] })

const categoryTree = [
  {
    name: 'Men', slug: 'men',
    description: 'Premium menswear across eastern wear, western wear, top wear, bottom wear, footwear, and accessories.',
    children: [
      { name: 'Eastern Wear', slug: 'eastern-wear', description: 'Refined shalwar kameez, kurtas, waistcoats, prince coats, and sherwanis.', children: [
        child('Shalwar Kameez', 'shalwar-kameez', 'Classic tailored sets in breathable seasonal fabrics.'),
        child('Kurta', 'kurta', 'Polished standalone kurtas for daily and occasion dressing.'),
        child('Kurta Pajama', 'kurta-pajama', 'Coordinated kurta pajama looks with a clean modern fit.'),
        child('Waistcoat', 'waistcoat', 'Structured layers for elevating eastern wear.'),
        child('Prince Coat', 'prince-coat', 'Formal statement layers with sharp detailing.'),
        child('Sherwani', 'sherwani', 'Ceremonial tailoring for weddings and special events.'),
      ]},
      { name: 'Western Wear', slug: 'western-wear', description: 'Clean shirts, polos, tees, denim, tailoring, and jackets.', children: [
        child('Shirts', 'shirts', 'Crisp casual and formal shirts with modern proportions.'),
        child('Polo Shirts', 'polo-shirts', 'Soft collar essentials for smart casual dressing.'),
        child('T-Shirts', 't-shirts', 'Premium basics cut for daily comfort.'),
        child('Blazers', 'blazers', 'Sharp layers for dinner, work, and occasions.'),
        child('Suits', 'suits', 'Coordinated tailoring for formal wardrobes.'),
        child('Jeans', 'jeans', 'Everyday denim in reliable washes and fits.'),
        child('Pants', 'pants', 'Tailored and relaxed trousers for repeat wear.'),
        child('Jackets', 'jackets', 'Seasonal outerwear with practical polish.'),
      ]},
      { name: 'Top Wear', slug: 'top-wear', description: 'Shirts, polos, tees, sweatshirts, and hoodies for daily layering.', children: [
        child('Shirts', 'top-shirts', 'Shirts designed for repeat wear.'),
        child('Polo Shirts', 'top-polo-shirts', 'Polos with clean casual structure.'),
        child('T-Shirts', 'top-t-shirts', 'Premium tees for everyday comfort.'),
        child('Sweatshirts', 'sweatshirts', 'Soft layers for cooler days.'),
        child('Hoodies', 'hoodies', 'Relaxed hooded essentials.'),
      ]},
      { name: 'Bottom Wear', slug: 'bottom-wear', description: 'Dress pants, denim, chinos, and casual trousers built around fit.', children: [
        child('Dress Pants', 'dress-pants', 'Formal trousers for work and occasion styling.'),
        child('Jeans', 'bottom-jeans', 'Everyday denim in reliable washes and fits.'),
        child('Chinos', 'chinos', 'Versatile cotton trousers for polished daily outfits.'),
        child('Casual Pants', 'casual-pants', 'Relaxed trousers made for comfort and movement.'),
      ]},
      { name: 'Footwear', slug: 'footwear', description: 'Sneakers, loafers, chappals, formal shoes, and sandals.', children: [
        child('Sneakers', 'sneakers', 'Clean low-profile sneakers for everyday wear.'),
        child('Loafers', 'loafers', 'Slip-on shoes for refined casual styling.'),
        child('Peshawari Chappal', 'peshawari-chappal', 'Heritage footwear with timeless regional character.'),
        child('Formal Shoes', 'formal-shoes', 'Polished shoes for suits and ceremonial outfits.'),
        child('Sandals', 'sandals', 'Open footwear for warm-weather comfort.'),
      ]},
      { name: 'Accessories', slug: 'accessories', description: 'Belts, wallets, perfumes, watches, and caps.', children: [
        child('Belts', 'belts', 'Leather and casual belts for daily finishing.'),
        child('Wallets', 'wallets', 'Compact carry pieces with premium texture.'),
        child('Perfumes', 'perfumes', 'Signature scents for day and evening.'),
        child('Watches', 'watches', 'Timepieces selected for understated polish.'),
        child('Caps', 'caps', 'Casual headwear for off-duty styling.'),
      ]},
    ],
  },
  {
    name: 'Women', slug: 'women',
    description: 'Premium womenswear across eastern wear, western wear, top wear, bottom wear, footwear, and accessories.',
    children: [
      { name: 'Eastern Wear', slug: 'women-eastern-wear', description: 'Elegant eastern silhouettes for daywear, occasions, and celebrations.', children: [
        child('Stitched Suits', 'women-stitched-suits', 'Ready-to-wear eastern suits with polished finishing.'),
        child('Kurtas', 'women-kurtas', 'Printed and solid kurtas for refined everyday dressing.'),
        child('Kurta Trousers', 'women-kurta-trousers', 'Coordinated kurta and trouser sets.'),
        child('Dupatta Sets', 'women-dupatta-sets', 'Complete eastern looks with matching dupattas.'),
        child('Formals', 'women-formals', 'Occasion-ready formal eastern wear.'),
        child('Embroidered', 'women-embroidered', 'Detailed embroidery for elevated dressing.'),
      ]},
      { name: 'Western Wear', slug: 'women-western-wear', description: 'Contemporary western separates for a premium wardrobe.', children: [
        child('Shirts', 'women-shirts', 'Crisp shirts with modern proportions.'),
        child('Blouses', 'women-blouses', 'Soft blouses for work and evening styling.'),
        child('T-Shirts', 'women-t-shirts', 'Premium tees for daily wear.'),
        child('Blazers', 'women-blazers', 'Tailored layers with quiet polish.'),
        child('Dresses', 'women-dresses', 'Easy dresses for day and evening.'),
        child('Jeans', 'women-jeans', 'Denim staples in versatile fits.'),
        child('Pants', 'women-pants', 'Smart trousers for everyday styling.'),
      ]},
      { name: 'Top Wear', slug: 'women-top-wear', description: 'Tops, shirts, tees, sweatshirts, and hoodies.', children: [
        child('Tops', 'women-tops', 'Everyday tops with refined details.'),
        child('Shirts', 'women-top-shirts', 'Structured shirts for daily polish.'),
        child('T-Shirts', 'women-top-t-shirts', 'Soft tees for layered wardrobes.'),
        child('Sweatshirts', 'women-sweatshirts', 'Comfortable layers for cooler days.'),
        child('Hoodies', 'women-hoodies', 'Relaxed hooded essentials.'),
      ]},
      { name: 'Bottom Wear', slug: 'women-bottom-wear', description: 'Trousers, denim, culottes, and skirts.', children: [
        child('Trousers', 'women-trousers', 'Tailored trousers for work and daily wear.'),
        child('Jeans', 'women-bottom-jeans', 'Versatile denim staples.'),
        child('Culottes', 'women-culottes', 'Wide-leg comfort with clean structure.'),
        child('Skirts', 'women-skirts', 'Skirts for easy day-to-evening styling.'),
      ]},
      { name: 'Footwear', slug: 'women-footwear', description: 'Flats, heels, sneakers, sandals, and khussas.', children: [
        child('Flats', 'women-flats', 'Refined flats for daily wear.'),
        child('Heels', 'women-heels', 'Polished heels for formal and evening looks.'),
        child('Sneakers', 'women-sneakers', 'Clean sneakers for casual styling.'),
        child('Sandals', 'women-sandals', 'Open footwear for warm-weather comfort.'),
        child('Khussas', 'women-khussas', 'Traditional footwear with dressed-up character.'),
      ]},
      { name: 'Accessories', slug: 'women-accessories', description: 'Bags, scarves, perfumes, jewelry, and wallets.', children: [
        child('Bags', 'women-bags', 'Structured and soft bags for daily use.'),
        child('Scarves', 'women-scarves', 'Lightweight scarves for finishing looks.'),
        child('Perfumes', 'women-perfumes', 'Signature scents for day and evening.'),
        child('Jewelry', 'women-jewelry', 'Subtle jewelry for polished styling.'),
        child('Wallets', 'women-wallets', 'Compact carry pieces with premium texture.'),
      ]},
    ],
  },
]

// Recursively upsert a category tree, returning a slug → _id map for every node
async function seedCategories(nodes, parentId = null, map = {}) {
  for (const node of nodes) {
    const doc = await Category.findOneAndUpdate(
      { slug: node.slug },
      { name: node.name, slug: node.slug, description: node.description || '', parent: parentId },
      { upsert: true, new: true }
    )
    map[node.slug] = doc._id
    if (node.children?.length) {
      await seedCategories(node.children, doc._id, map)
    }
  }
  return map
}

// ---------------------------------------------------------------------------
// 2. Product generation — mirrors frontend/src/data/products.js
// ---------------------------------------------------------------------------
const menTitles = [
  'Ivory Classic Shalwar Kameez', 'Onyx Formal Shalwar Kameez', 'Sand Beige Everyday Set',
  'Olive Minimal Kurta Shalwar', 'Navy Occasion Kurta', 'White Textured Shirt',
  'Black Resort Collar Shirt', 'Tailored Straight Pants', 'Sand Relaxed Pants',
  'Cream Premium Co-Ord', 'Charcoal Eid Ready Set', 'Taupe Comfort Shalwar Kameez',
  'Stone Summer Kurta', 'Deep Green Co-Ord', 'Midnight Formal Shirt',
  'Pearl Friday Kurta', 'Slate Grey Tailored Set', 'Walnut Daily Pants',
  'Soft White Eastern Set', 'Olive Utility Shirt', 'Navy Wash & Wear Set',
  'Black Minimal Kurta', 'Cream Linen Shirt', 'Sand Structured Co-Ord',
  'Ivory Premium Kurta', 'Charcoal Straight Pants', 'Taupe Eid Kurta Shalwar',
  'White Classic Kameez', 'Olive Relaxed Co-Ord', 'Black Heritage Set',
]

function menTaxonomy(title) {
  const lower = title.toLowerCase()
  if (lower.includes('pants')) return ['bottom-wear', 'casual-pants']
  if (lower.includes('shirt')) return ['top-wear', 'top-shirts']
  if (lower.includes('co-ord')) return ['eastern-wear', 'kurta-pajama']
  if (lower.includes('kurta shalwar')) return ['eastern-wear', 'kurta-pajama']
  if (lower.includes('kurta')) return ['eastern-wear', 'kurta']
  if (lower.includes('kameez') || lower.includes('set')) return ['eastern-wear', 'shalwar-kameez']
  return ['eastern-wear', 'shalwar-kameez']
}

const womenEntries = [
  ['Blush Embroidered Stitched Suit', 'women-eastern-wear', 'women-stitched-suits'],
  ['Ivory Festive Stitched Suit', 'women-eastern-wear', 'women-stitched-suits'],
  ['Rose Printed Kurta', 'women-eastern-wear', 'women-kurtas'],
  ['Sage Everyday Kurta', 'women-eastern-wear', 'women-kurtas'],
  ['Champagne Dupatta Set', 'women-eastern-wear', 'women-dupatta-sets'],
  ['Emerald Formal Embroidered', 'women-eastern-wear', 'women-embroidered'],
  ['Classic White Shirt', 'women-western-wear', 'women-shirts'],
  ['Powder Blue Blouse', 'women-western-wear', 'women-blouses'],
  ['Terracotta Day Dress', 'women-western-wear', 'women-dresses'],
  ['Indigo Straight Jeans', 'women-western-wear', 'women-jeans'],
  ['Stone Everyday Top', 'women-top-wear', 'women-tops'],
  ['Charcoal Cotton T-Shirt', 'women-top-wear', 'women-top-t-shirts'],
  ['Camel Tailored Trousers', 'women-bottom-wear', 'women-trousers'],
  ['Black Pleated Skirt', 'women-bottom-wear', 'women-skirts'],
  ['Nude Block Heels', 'women-footwear', 'women-heels'],
  ['Tan Everyday Flats', 'women-footwear', 'women-flats'],
]

const accessorySubs = [
  ['Belt', 'accessories', 'belts'], ['Wallet', 'accessories', 'wallets'],
  ['Perfume', 'accessories', 'perfumes'], ['Watch', 'accessories', 'watches'],
  ['Cap', 'accessories', 'caps'], ['Bag', 'women-accessories', 'women-bags'],
  ['Scarf', 'women-accessories', 'women-scarves'], ['Perfume', 'women-accessories', 'women-perfumes'],
  ['Jewelry Set', 'women-accessories', 'women-jewelry'], ['Wallet', 'women-accessories', 'women-wallets'],
]
const accessoryStyles = ['Classic', 'Premium', 'Signature', 'Heritage', 'Everyday']

function departmentOf(categorySlugMap, subSlug) {
  // walk parents up to the department node (Men / Women)
  return subSlug.startsWith('women') ? 'Women' : 'Men'
}

function buildProduct({ title, categorySlug, subcategorySlug, index }) {
  const price = 3490 + (index % 9) * 650
  const collection =
    index % 5 === 0 ? 'Best Sellers' :
    index % 3 === 0 ? 'New Arrivals' :
    index % 2 === 0 ? 'Summer Edit' : 'Premium Line'
  const season = index % 2 === 0 ? 'Summer' : 'All Season'
  const tones = ['cream', 'black', 'sand', 'olive', 'navy', 'white', 'charcoal', 'taupe']
  const tone = tones[index % tones.length]
  const gender = departmentOf(null, categorySlug)
  const badge = index % 5 === 0 ? 'Best Seller' : index % 3 === 0 ? 'New' : ''

  return {
    title,
    categorySlug,
    subcategorySlug,
    gender,
    price,
    comparePrice: price + 1200,
    colors: [tone],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: [collection, season, tone].filter(Boolean),
    collectionName: collection,
    season,
    stockQuantity: 15 + ((index * 7) % 40),
    badge,
    description: `A refined piece made for breathable comfort, clean structure, and modern styling.`,
  }
}

function generateAllProducts() {
  const menProducts = menTitles.map((title, index) => {
    const [categorySlug, subcategorySlug] = menTaxonomy(title)
    return buildProduct({ title, categorySlug, subcategorySlug, index })
  })

  const womenProducts = womenEntries.map(([title, categorySlug, subcategorySlug], i) =>
    buildProduct({ title, categorySlug, subcategorySlug, index: i })
  )

  const accessoryProducts = accessorySubs.flatMap(([label, categorySlug, subcategorySlug]) =>
    accessoryStyles.map((style, i) =>
      buildProduct({ title: `${style} ${label}`, categorySlug, subcategorySlug, index: i })
    )
  )

  const placeholderProducts = [
    buildProduct({ title: 'Classic Low Sneaker', categorySlug: 'footwear', subcategorySlug: 'sneakers', index: 3 }),
    buildProduct({ title: 'Heritage Peshawari Chappal', categorySlug: 'footwear', subcategorySlug: 'peshawari-chappal', index: 6 }),
  ]

  return [...menProducts, ...womenProducts, ...accessoryProducts, ...placeholderProducts]
}

// ---------------------------------------------------------------------------
// 3. Run
// ---------------------------------------------------------------------------
async function run() {
  await connectDB()

  console.log('Seeding categories...')
  const slugToId = await seedCategories(categoryTree)
  console.log(`  ${Object.keys(slugToId).length} categories ready`)

  const admin = await User.findOne({ role: 'admin' })
  if (!admin) {
    console.error('❌ No admin user found. Create/promote an admin account before seeding products.')
    process.exit(1)
  }

  console.log('Seeding products...')
  const productDrafts = generateAllProducts()
  let created = 0
  let skipped = 0

  for (const draft of productDrafts) {
    const slug = draft.title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-')
    const categoryId = slugToId[draft.categorySlug]
    const subcategoryId = slugToId[draft.subcategorySlug]

    if (!categoryId) {
      console.warn(`  ⚠ Skipping "${draft.title}" — category "${draft.categorySlug}" not found`)
      skipped++
      continue
    }

    const exists = await Product.findOne({ slug })
    if (exists) {
      skipped++
      continue
    }

    await Product.create({
      title: draft.title,
      slug,
      description: draft.description,
      category: categoryId,
      subcategory: subcategoryId || null,
      gender: draft.gender,
      price: draft.price,
      comparePrice: draft.comparePrice,
      images: [],
      colors: draft.colors,
      sizes: draft.sizes,
      tags: draft.tags,
      collectionName: draft.collectionName,
      season: draft.season,
      stockQuantity: draft.stockQuantity,
      badge: draft.badge,
      createdBy: admin._id,
    })
    created++
  }

  console.log(`  ${created} products created, ${skipped} already existed / skipped`)
  console.log('✅ Seed complete')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
