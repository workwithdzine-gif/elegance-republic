// Hosted product photography, keyed by product id.
//
// The default convention is filename-based: a product's shots live at
// images/products/<imageId>.jpg (and -2 for the hover view). This map is the
// escape hatch for products whose photos are hosted elsewhere — js/utils.js
// productImage() checks here first.
//
//   photos[0] — the card / primary shot
//   photos[1] — the shot the card cuts to on hover
//
// WHY keyed by id, in its own module, rather than a field set on the product
// objects: js/api/catalog-loader.js replaces the entire products array in place
// when the backend is reachable, which would drop any field attached to the
// bundled objects. A lookup by id survives that.
//
// The Cloudinary `f_auto,q_auto,w_900` transform is doing real work — the source
// uploads are 1.58MB and 1.33MB PNGs and these serve ~0.3MB each, in whatever
// format the browser prefers. Keep it on any URL added here.
const CDN = "https://res.cloudinary.com/zyup6grh/image/upload/f_auto,q_auto,w_900";

export const productPhotos = {
  // Men → Top Wear → Shirts → White Textured Shirt
  "ew-006": [
    `${CDN}/v1784253489/Untitled_-_July_17_2026_at_06.52.16_us8kgs.png`,
    `${CDN}/v1784253479/Untitled_-_July_17_2026_at_06.56.54_ojxcfd.png`
  ]
};
