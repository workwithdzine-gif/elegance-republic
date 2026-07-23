const categoryImage = (slug) => `images/categories/${slug}.jpg`;

const child = (id, name, slug, parent, description) => ({
  id,
  name,
  slug,
  image: categoryImage(slug),
  description,
  parent,
  children: []
});

const category = (id, name, slug, parent, imageSlug, description, children) => ({
  id,
  name,
  slug,
  image: categoryImage(imageSlug || slug),
  description,
  parent,
  children
});

export const categories = [
  {
    id: "men",
    name: "Men",
    slug: "men",
    image: categoryImage("men"),
    description: "Premium menswear across eastern wear, western wear, top wear, bottom wear, footwear, and accessories.",
    parent: null,
    children: [
      category("men-eastern", "Eastern Wear", "eastern-wear", "men", "shalwar-kameez", "Refined shalwar kameez, kurtas, waistcoats, prince coats, and sherwanis.", [
        child("men-shalwar-kameez", "Shalwar Kameez", "shalwar-kameez", "men-eastern", "Classic tailored sets in breathable seasonal fabrics."),
        child("men-kurta", "Kurta", "kurta", "men-eastern", "Polished standalone kurtas for daily and occasion dressing."),
        child("men-kurta-pajama", "Kurta Pajama", "kurta-pajama", "men-eastern", "Coordinated kurta pajama looks with a clean modern fit."),
        child("men-waistcoat", "Waistcoat", "waistcoat", "men-eastern", "Structured layers for elevating eastern wear."),
        child("men-prince-coat", "Prince Coat", "prince-coat", "men-eastern", "Formal statement layers with sharp detailing."),
        child("men-sherwani", "Sherwani", "sherwani", "men-eastern", "Ceremonial tailoring for weddings and special events.")
      ]),
      category("men-western", "Western Wear", "western-wear", "men", "shirts", "Clean shirts, polos, tees, denim, tailoring, and jackets.", [
        child("men-shirts", "Shirts", "shirts", "men-western", "Crisp casual and formal shirts with modern proportions."),
        child("men-polo-shirts", "Polo Shirts", "polo-shirts", "men-western", "Soft collar essentials for smart casual dressing."),
        child("men-t-shirts", "T-Shirts", "t-shirts", "men-western", "Premium basics cut for daily comfort."),
        child("men-blazers", "Blazers", "blazers", "men-western", "Sharp layers for dinner, work, and occasions."),
        child("men-suits", "Suits", "suits", "men-western", "Coordinated tailoring for formal wardrobes."),
        child("men-jeans", "Jeans", "jeans", "men-western", "Everyday denim in reliable washes and fits."),
        child("men-pants", "Pants", "pants", "men-western", "Tailored and relaxed trousers for repeat wear."),
        child("men-jackets", "Jackets", "jackets", "men-western", "Seasonal outerwear with practical polish.")
      ]),
      category("men-top-wear", "Top Wear", "top-wear", "men", "shirts", "Shirts, polos, tees, sweatshirts, and hoodies for daily layering.", [
        child("men-top-shirts", "Shirts", "top-shirts", "men-top-wear", "Shirts designed for repeat wear."),
        child("men-top-polo-shirts", "Polo Shirts", "top-polo-shirts", "men-top-wear", "Polos with clean casual structure."),
        child("men-top-t-shirts", "T-Shirts", "top-t-shirts", "men-top-wear", "Premium tees for everyday comfort."),
        child("men-sweatshirts", "Sweatshirts", "sweatshirts", "men-top-wear", "Soft layers for cooler days."),
        child("men-hoodies", "Hoodies", "hoodies", "men-top-wear", "Relaxed hooded essentials.")
      ]),
      category("men-bottom-wear", "Bottom Wear", "bottom-wear", "men", "pants", "Dress pants, denim, chinos, and casual trousers built around fit.", [
        child("men-dress-pants", "Dress Pants", "dress-pants", "men-bottom-wear", "Formal trousers for work and occasion styling."),
        child("men-bottom-jeans", "Jeans", "bottom-jeans", "men-bottom-wear", "Everyday denim in reliable washes and fits."),
        child("men-chinos", "Chinos", "chinos", "men-bottom-wear", "Versatile cotton trousers for polished daily outfits."),
        child("men-casual-pants", "Casual Pants", "casual-pants", "men-bottom-wear", "Relaxed trousers made for comfort and movement.")
      ]),
      category("men-footwear", "Footwear", "footwear", "men", "footwear", "Sneakers, loafers, chappals, formal shoes, and sandals.", [
        child("men-sneakers", "Sneakers", "sneakers", "men-footwear", "Clean low-profile sneakers for everyday wear."),
        child("men-loafers", "Loafers", "loafers", "men-footwear", "Slip-on shoes for refined casual styling."),
        child("men-peshawari-chappal", "Peshawari Chappal", "peshawari-chappal", "men-footwear", "Heritage footwear with timeless regional character."),
        child("men-formal-shoes", "Formal Shoes", "formal-shoes", "men-footwear", "Polished shoes for suits and ceremonial outfits."),
        child("men-sandals", "Sandals", "sandals", "men-footwear", "Open footwear for warm-weather comfort.")
      ]),
      category("men-accessories", "Accessories", "accessories", "men", "co-ords", "Belts, wallets, perfumes, watches, and caps.", [
        child("men-belts", "Belts", "belts", "men-accessories", "Leather and casual belts for daily finishing."),
        child("men-wallets", "Wallets", "wallets", "men-accessories", "Compact carry pieces with premium texture."),
        child("men-perfumes", "Perfumes", "perfumes", "men-accessories", "Signature scents for day and evening."),
        child("men-watches", "Watches", "watches", "men-accessories", "Timepieces selected for understated polish."),
        child("men-caps", "Caps", "caps", "men-accessories", "Casual headwear for off-duty styling.")
      ])
    ]
  },
  {
    id: "women",
    name: "Women",
    slug: "women",
    image: categoryImage("women"),
    description: "Premium womenswear across eastern wear, western wear, top wear, bottom wear, footwear, and accessories.",
    parent: null,
    children: [
      category("women-eastern", "Eastern Wear", "women-eastern-wear", "women", "shalwar-kameez", "Elegant eastern silhouettes for daywear, occasions, and celebrations.", [
        child("women-stitched-suits", "Stitched Suits", "women-stitched-suits", "women-eastern", "Ready-to-wear eastern suits with polished finishing."),
        child("women-kurtas", "Kurtas", "women-kurtas", "women-eastern", "Printed and solid kurtas for refined everyday dressing."),
        child("women-kurta-trousers", "Kurta Trousers", "women-kurta-trousers", "women-eastern", "Coordinated kurta and trouser sets."),
        child("women-dupatta-sets", "Dupatta Sets", "women-dupatta-sets", "women-eastern", "Complete eastern looks with matching dupattas."),
        child("women-formals", "Formals", "women-formals", "women-eastern", "Occasion-ready formal eastern wear."),
        child("women-embroidered", "Embroidered", "women-embroidered", "women-eastern", "Detailed embroidery for elevated dressing.")
      ]),
      category("women-western", "Western Wear", "women-western-wear", "women", "shirts", "Contemporary western separates for a premium wardrobe.", [
        child("women-shirts", "Shirts", "women-shirts", "women-western", "Crisp shirts with modern proportions."),
        child("women-blouses", "Blouses", "women-blouses", "women-western", "Soft blouses for work and evening styling."),
        child("women-t-shirts", "T-Shirts", "women-t-shirts", "women-western", "Premium tees for daily wear."),
        child("women-blazers", "Blazers", "women-blazers", "women-western", "Tailored layers with quiet polish."),
        child("women-dresses", "Dresses", "women-dresses", "women-western", "Easy dresses for day and evening."),
        child("women-jeans", "Jeans", "women-jeans", "women-western", "Denim staples in versatile fits."),
        child("women-pants", "Pants", "women-pants", "women-western", "Smart trousers for everyday styling.")
      ]),
      category("women-top-wear", "Top Wear", "women-top-wear", "women", "shirts", "Tops, shirts, tees, sweatshirts, and hoodies.", [
        child("women-tops", "Tops", "women-tops", "women-top-wear", "Everyday tops with refined details."),
        child("women-shirts-top", "Shirts", "women-top-shirts", "women-top-wear", "Structured shirts for daily polish."),
        child("women-tees-top", "T-Shirts", "women-top-t-shirts", "women-top-wear", "Soft tees for layered wardrobes."),
        child("women-sweatshirts", "Sweatshirts", "women-sweatshirts", "women-top-wear", "Comfortable layers for cooler days."),
        child("women-hoodies", "Hoodies", "women-hoodies", "women-top-wear", "Relaxed hooded essentials.")
      ]),
      category("women-bottom-wear", "Bottom Wear", "women-bottom-wear", "women", "pants", "Trousers, denim, culottes, and skirts.", [
        child("women-trousers", "Trousers", "women-trousers", "women-bottom-wear", "Tailored trousers for work and daily wear."),
        child("women-jeans-bottom", "Jeans", "women-bottom-jeans", "women-bottom-wear", "Versatile denim staples."),
        child("women-culottes", "Culottes", "women-culottes", "women-bottom-wear", "Wide-leg comfort with clean structure."),
        child("women-skirts", "Skirts", "women-skirts", "women-bottom-wear", "Skirts for easy day-to-evening styling.")
      ]),
      category("women-footwear", "Footwear", "women-footwear", "women", "footwear", "Flats, heels, sneakers, sandals, and khussas.", [
        child("women-flats", "Flats", "women-flats", "women-footwear", "Refined flats for daily wear."),
        child("women-heels", "Heels", "women-heels", "women-footwear", "Polished heels for formal and evening looks."),
        child("women-sneakers", "Sneakers", "women-sneakers", "women-footwear", "Clean sneakers for casual styling."),
        child("women-sandals", "Sandals", "women-sandals", "women-footwear", "Open footwear for warm-weather comfort."),
        child("women-khussas", "Khussas", "women-khussas", "women-footwear", "Traditional footwear with dressed-up character.")
      ]),
      category("women-accessories", "Accessories", "women-accessories", "women", "co-ords", "Bags, scarves, perfumes, jewelry, and wallets.", [
        child("women-bags", "Bags", "women-bags", "women-accessories", "Structured and soft bags for daily use."),
        child("women-scarves", "Scarves", "women-scarves", "women-accessories", "Lightweight scarves for finishing looks."),
        child("women-perfumes", "Perfumes", "women-perfumes", "women-accessories", "Signature scents for day and evening."),
        child("women-jewelry", "Jewelry", "women-jewelry", "women-accessories", "Subtle jewelry for polished styling."),
        child("women-wallets", "Wallets", "women-wallets", "women-accessories", "Compact carry pieces with premium texture.")
      ])
    ]
  }
];

export function getDepartment(slug = "men") {
  return categories.find((department) => department.slug === slug) || categories[0];
}

export function getDepartmentCategories(slug = "men") {
  return getDepartment(slug).children;
}

export const topLevelCategories = getDepartmentCategories("men");

export function walkCategories(nodes = categories, visit, trail = []) {
  nodes.forEach((item) => {
    const nextTrail = [...trail, item];
    visit(item, nextTrail);
    if (item.children?.length) walkCategories(item.children, visit, nextTrail);
  });
}

export function flattenCategories(nodes = categories) {
  const list = [];
  walkCategories(nodes, (item, trail) => list.push({ ...item, trail }));
  return list;
}

export const allCategories = flattenCategories();

export const categorySlugs = allCategories.reduce((acc, item) => {
  acc[item.slug] = item.name;
  return acc;
}, {});

export function slugForCategory(name) {
  const found = allCategories.find((item) => item.name.toLowerCase() === String(name).toLowerCase());
  return found?.slug || String(name).toLowerCase().replaceAll(" ", "-");
}

export function getCategoryBySlug(slug) {
  return allCategories.find((item) => item.slug === slug) || null;
}

export function getCategoryTrail(slug) {
  return allCategories.find((item) => item.slug === slug)?.trail || [];
}

export function getCategoryDepartment(slug) {
  return getCategoryTrail(slug)[0] || categories[0];
}

export function getTopLevelCategory(slug) {
  const department = getCategoryDepartment(slug);
  const trail = getCategoryTrail(slug);
  return trail.find((item) => item.parent === department.slug) || trail[0] || null;
}

export function getDescendantSlugs(slug) {
  const node = getCategoryBySlug(slug);
  if (!node) return [];
  const slugs = [];
  walkCategories([node], (item) => slugs.push(item.slug));
  return slugs;
}

export function categoryUrl(slug) {
  return `/category?cat=${slug}`;
}
