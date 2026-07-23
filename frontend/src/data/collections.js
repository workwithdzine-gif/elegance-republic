import { topLevelCategories, categoryUrl } from "./categories.js";

export const navLinks = [
  ["Home", "/"],
  ["Categories", "/collection"],
  ...topLevelCategories.map((category) => [category.name, categoryUrl(category.slug)]),
  ["New Arrivals", "/collection?collection=new-arrivals"]
];

export const collections = [
  {
    id: "new-arrivals",
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "The newest Elegance Republic pieces across eastern wear, western wear, footwear, and accessories."
  },
  {
    id: "best-sellers",
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Customer favorites selected for reliable fit, polish, and repeat wear."
  },
  {
    id: "summer-edit",
    name: "Summer Edit",
    slug: "summer-edit",
    description: "Breathable seasonal essentials for warm-weather dressing."
  },
  {
    id: "premium-line",
    name: "Premium Line",
    slug: "premium-line",
    description: "Elevated fabrics, sharper finishing, and refined occasion pieces."
  },
  {
    id: "sale",
    name: "Sale",
    slug: "sale",
    description: "Limited-time pricing across selected Elegance Republic styles."
  }
];

export const priceOptions = [
  ["all", "All prices"],
  ["under-5000", "Under PKR.5,000"],
  ["5000-8000", "PKR.5,000 to PKR.8,000"],
  ["above-8000", "Above PKR.8,000"]
];
