// Product catalog — one reusable generator drives both departments.
// Men products map to the existing eastern-wear photo set (ew-0XX.jpg). Women
// products are data-only placeholders that REUSE the same photos via `imageId`
// until real womenswear photography is added — swap `imageId` for real files
// (or drop in women-<subcategory>-01.webp per js/assets.js) with no code change.
import { getCategoryBySlug, getCategoryTrail, topLevelCategories } from "./categories.js";

export const visualTones = ["cream", "black", "sand", "olive", "navy", "white", "charcoal", "taupe"];

// Shared factory — the single source of truth for a product record. Gender is
// derived from the category trail, so passing a men or women category slug is
// all that distinguishes the two departments.
function makeProduct({ id, title, parentCategorySlug, subcategorySlug, index, imageId }) {
  const tone = visualTones[index % visualTones.length];
  const price = 3490 + (index % 9) * 650;
  const lowerTitle = title.toLowerCase();
  const parentNode = getCategoryBySlug(parentCategorySlug);
  const subcategoryNode = getCategoryBySlug(subcategorySlug);
  const parentCategory = parentNode?.name || "Eastern Wear";
  const subcategory = subcategoryNode?.name || "Shalwar Kameez";
  const department = getCategoryTrail(parentCategorySlug)[0]?.name || "Men";
  const collection =
    index % 5 === 0 ? "Best Sellers" :
    index % 3 === 0 ? "New Arrivals" :
    index % 2 === 0 ? "Summer Edit" :
    "Premium Line";
  const season = index % 2 === 0 ? "Summer" : "All Season";
  const tags = [
    parentCategory,
    subcategory,
    collection,
    season,
    tone,
    department,
    lowerTitle.includes("designer") ? "Designer" : "",
    lowerTitle.includes("formal") ? "Formal" : "",
    lowerTitle.includes("eid") ? "Eid" : "",
    lowerTitle.includes("premium") ? "Premium" : ""
  ].filter(Boolean);
  return {
    id,
    title,
    category: parentCategory,
    categorySlug: parentCategorySlug,
    subcategory,
    subcategorySlug,
    collection,
    tags,
    gender: department,
    season,
    price,
    comparePrice: price + 1200,
    images: [tone, visualTones[(index + 1) % visualTones.length], visualTones[(index + 2) % visualTones.length]],
    color: tone,
    // Photo file id (defaults to the product id). Women reuse men photos for now.
    imageId: imageId || id,
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: index % 11 !== 0,
    rating: Number((4.2 + (index % 7) * 0.1).toFixed(1)),
    // PLACEHOLDER demo value only — wire to real order data before going live.
    sold: 240 + ((index * 137) % 1400),
    badge: index % 5 === 0 ? "Best Seller" : index % 3 === 0 ? "New" : "Premium",
    description: `A refined ${subcategory.toLowerCase()} piece made for breathable comfort, clean structure, and modern styling.`
  };
}

// ---- Men (existing eastern-wear titles → existing photos) -------------------
const menTitles = [
  "Ivory Classic Shalwar Kameez",
  "Onyx Formal Shalwar Kameez",
  "Sand Beige Everyday Set",
  "Olive Minimal Kurta Shalwar",
  "Navy Occasion Kurta",
  "White Textured Shirt",
  "Black Resort Collar Shirt",
  "Tailored Straight Pants",
  "Sand Relaxed Pants",
  "Cream Premium Co-Ord",
  "Charcoal Eid Ready Set",
  "Taupe Comfort Shalwar Kameez",
  "Stone Summer Kurta",
  "Deep Green Co-Ord",
  "Midnight Formal Shirt",
  "Pearl Friday Kurta",
  "Slate Grey Tailored Set",
  "Walnut Daily Pants",
  "Soft White Eastern Set",
  "Olive Utility Shirt",
  "Navy Wash & Wear Set",
  "Black Minimal Kurta",
  "Cream Linen Shirt",
  "Sand Structured Co-Ord",
  "Ivory Premium Kurta",
  "Charcoal Straight Pants",
  "Taupe Eid Kurta Shalwar",
  "White Classic Kameez",
  "Olive Relaxed Co-Ord",
  "Black Heritage Set"
];

function menTaxonomy(title) {
  const lower = title.toLowerCase();
  if (lower.includes("pants")) return ["bottom-wear", "casual-pants"];
  if (lower.includes("shirt")) return ["top-wear", "top-shirts"];
  if (lower.includes("co-ord")) return ["eastern-wear", "kurta-pajama"];
  if (lower.includes("kurta shalwar")) return ["eastern-wear", "kurta-pajama"];
  if (lower.includes("kurta")) return ["eastern-wear", "kurta"];
  if (lower.includes("kameez") || lower.includes("set")) return ["eastern-wear", "shalwar-kameez"];
  return ["eastern-wear", "shalwar-kameez"];
}

const menProducts = menTitles.map((title, index) => {
  const [parentCategorySlug, subcategorySlug] = menTaxonomy(title);
  return makeProduct({
    id: `ew-${String(index + 1).padStart(3, "0")}`,
    title,
    parentCategorySlug,
    subcategorySlug,
    index
  });
});

// ---- Women (data-only placeholders, reusing men photos via imageId) ---------
// Each entry: [title, parentCategorySlug, subcategorySlug]
const womenEntries = [
  ["Blush Embroidered Stitched Suit", "women-eastern-wear", "women-stitched-suits"],
  ["Ivory Festive Stitched Suit", "women-eastern-wear", "women-stitched-suits"],
  ["Rose Printed Kurta", "women-eastern-wear", "women-kurtas"],
  ["Sage Everyday Kurta", "women-eastern-wear", "women-kurtas"],
  ["Champagne Dupatta Set", "women-eastern-wear", "women-dupatta-sets"],
  ["Emerald Formal Embroidered", "women-eastern-wear", "women-embroidered"],
  ["Classic White Shirt", "women-western-wear", "women-shirts"],
  ["Powder Blue Blouse", "women-western-wear", "women-blouses"],
  ["Terracotta Day Dress", "women-western-wear", "women-dresses"],
  ["Indigo Straight Jeans", "women-western-wear", "women-jeans"],
  ["Stone Everyday Top", "women-top-wear", "women-tops"],
  ["Charcoal Cotton T-Shirt", "women-top-wear", "women-top-t-shirts"],
  ["Camel Tailored Trousers", "women-bottom-wear", "women-trousers"],
  ["Black Pleated Skirt", "women-bottom-wear", "women-skirts"],
  ["Nude Block Heels", "women-footwear", "women-heels"],
  ["Tan Everyday Flats", "women-footwear", "women-flats"]
];

const womenProducts = womenEntries.map(([title, parentCategorySlug, subcategorySlug], i) =>
  makeProduct({
    id: `ww-${String(i + 1).padStart(3, "0")}`,
    title,
    parentCategorySlug,
    subcategorySlug,
    index: i
  })
);

// ---- Accessories (dummy cards — 5 per subcategory, both departments) ---------
// [singularLabel, parentCategorySlug, subcategorySlug]
const accessorySubs = [
  ["Belt", "accessories", "belts"],
  ["Wallet", "accessories", "wallets"],
  ["Perfume", "accessories", "perfumes"],
  ["Watch", "accessories", "watches"],
  ["Cap", "accessories", "caps"],
  ["Bag", "women-accessories", "women-bags"],
  ["Scarf", "women-accessories", "women-scarves"],
  ["Perfume", "women-accessories", "women-perfumes"],
  ["Jewelry Set", "women-accessories", "women-jewelry"],
  ["Wallet", "women-accessories", "women-wallets"]
];
const accessoryStyles = ["Classic", "Premium", "Signature", "Heritage", "Everyday"];

const accessoryProducts = accessorySubs.flatMap(([label, parentCategorySlug, subcategorySlug]) =>
  accessoryStyles.map((style, i) =>
    makeProduct({
      id: `acc-${subcategorySlug}-${String(i + 1).padStart(2, "0")}`,
      title: `${style} ${label}`,
      parentCategorySlug,
      subcategorySlug,
      index: i
    })
  )
);

// Placeholder stock for sections that would otherwise render an empty grid.
// Men's Footwear had no products, so its tab showed nothing. Two dummies keep the
// section browsable until real inventory lands — delete these once it does.
const placeholderProducts = [
  makeProduct({
    id: "men-sneakers-01",
    title: "Classic Low Sneaker",
    parentCategorySlug: "footwear",
    subcategorySlug: "sneakers",
    index: 3
  }),
  makeProduct({
    id: "men-peshawari-01",
    title: "Heritage Peshawari Chappal",
    parentCategorySlug: "footwear",
    subcategorySlug: "peshawari-chappal",
    index: 6
  })
];

const customProducts = [
  {
    ...makeProduct({
      id: "women-pink-shoes",
      title: "Pink Shoes",
      parentCategorySlug: "women-footwear",
      subcategorySlug: "women-sandals",
      index: 16
    }),
    price: 5000,
    comparePrice: 6200,
    color: "pink",
    images: ["white", "cream", "sand"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    badge: "New",
    description: "Pink sandals made for easy warm-weather styling with a comfortable everyday fit."
  }
];

export const products = [...menProducts, ...womenProducts, ...accessoryProducts, ...placeholderProducts, ...customProducts];

// Assign each product a photo slot named  <subcategory>-<mn|wn><NN>  (e.g.
// kurta-mn01, shirt-wn01), numbered within its gender + subcategory group.
// This is the filename to drop a real photo in as; the hover view is <name>-2.
const photoSeq = {};
for (const product of products) {
  const code = product.gender === "Women" ? "wn" : "mn";
  const descriptor = String(product.subcategorySlug).replace(/^women-/, "");
  const key = `${descriptor}-${code}`;
  photoSeq[key] = (photoSeq[key] || 0) + 1;
  product.imageId = `${key}${String(photoSeq[key]).padStart(2, "0")}`;
}

// Hosted product photography lives in data/photos.js, keyed by id — see the note
// there for why it is not attached to these objects.

export const categoryList = topLevelCategories.map((category) => category.name);
export const productCategories = categoryList;
