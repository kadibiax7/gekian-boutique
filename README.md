# GEKIAN — Womenswear Storefront Prototype

A responsive **frontend-only** e-commerce concept built with Next.js App Router, TypeScript, Tailwind CSS, and Lucide icons.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3002.

## Features

- Editorial home page, category sections, and responsive product grid
- Collection search, filters, sorting, and favorites
- Product detail pages with galleries, variant selections, sizing, fit, and care information
- Local shopping bag drawer, quantity updates, and localStorage persistence
- Mobile navigation and responsive layouts
- Frontend-only: no working checkout or backend

## Source files

The current upload contains configuration files only. The application source folders (`app/`, `components/`, and `lib/`) still need to be uploaded.

## Before production

Products, pricing, stock, star ratings, review counts, shipping thresholds, and imagery in the prototype are mock/demo content. Replace with verified product and supplier information. Do not represent mock statistics as real reviews.

Before accepting payments, implement a genuine catalog, authentication, server-side price validation, Stripe Checkout, shipping/tax logic, verified reviews, and legal/policy pages.

## Live Firestore catalog

The homepage and `/products/[id]` now read actual Firestore products, filtering on `status == "staged"`. Search, category selection, and price sorting operate on the returned catalog; there is no fabricated product data. If no staged products are readable, the page shows an empty state or error.

Create `.env.local` from `.env.example` and fill in Firebase Web App configuration (not AliExpress or Admin credentials). For deployment, set the same `NEXT_PUBLIC_FIREBASE_*` environment variables on the hosting provider and redeploy.

**Security:** Firestore access rules must allow a public query filtered by `status == "staged"`, while denying client-side writes. The `admins` collection contains credentials and must NEVER be public for reads or writes. Manage imports using an authenticated administrative backend or a Firebase Admin SDK service account, not by temporarily opening public rules.

Example (integrate with your existing rules, preserving any other required restrictions):

```
match /products/{productId} {
  allow get: if resource.data.status == "staged";
  allow list: if resource.data.status == "staged";
  allow write: if false;
}
match /admins/{adminId} {
  allow read, write: if false;
}
```

The current query loads all staged products. Add pagination and query limits before scaling beyond a small catalog. Rules are not billing/rate limits.

This is a functional frontend catalog, not a complete e-commerce checkout. Product image mappings and price fields must be validated against actual Firestore documents; checkout, ordering, authentication, and inventory reconciliation remain unimplemented.
