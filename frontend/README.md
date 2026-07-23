# Z Elegance — React Storefront

A complete React + Vite conversion of the Elegance Republic customer storefront. The admin dashboard is intentionally excluded.

## Included

- Editorial landing page and animated storefront homepage
- Men, women, shop, new-arrival, category, and collection views
- Sorting, category, price, size, and availability filters
- Product galleries, variants, quantities, related items, reviews, and size guide
- Search, wishlist, cart drawer, full cart, and checkout
- Cash-on-delivery and demo card checkout options
- Order confirmation and browser-persistent order history
- Sign-in/register demo, saved addresses, password reset, and verification screens
- Contact form, FAQ, responsive navigation, footer, empty states, and 404 page

Cart, wishlist, account, addresses, and orders use `localStorage`, so the complete customer journey works without a backend. The checkout and authentication seams are ready to replace with real API calls.

## Run locally

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run lint
npm run build
npm run preview
```

## Main routes

- `/` — storefront homepage
- `/landing` — editorial splash landing page
- `/shop`, `/collection`, `/category`
- `/product?id=ew-001`
- `/search`, `/wishlist`, `/cart`, `/checkout`
- `/account`, `/contact`, `/reset-password`, `/verify-email`

For production hosting, all routes must fall back to `index.html`. A Vercel SPA rewrite is included in `vercel.json`.
