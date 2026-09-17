# 🛍️ Shopless

> A fast, minimal, and beautifully crafted modern e-commerce storefront built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**. Powered by real catalog data from the **DummyJSON API**.

---

## ✨ What is Shopless?

**Shopless** was built with a simple premise: online shopping should feel fast, effortless, and delightful. 

Instead of bloated layouts, loud popups, and cluttered interfaces, Shopless borrows design philosophy from platforms like **Apple**, **Shopify Dawn**, and **Vercel Commerce** — clean typography, generous spacing, thoughtful micro-animations, and instant feedback.

Whether you're shopping on an iPhone at 375px width or a 4K monitor, every interaction feels deliberate, polished, and responsive.

---

## 🚀 Key Features

### 🔍 Discovery & Catalog
- **Smart Catalog**: Filter by category, price slider, customer ratings, and real-time in-stock availability.
- **Dynamic Search**: Instant keyword search with URL query synchronization for shareable filters.
- **Editorial Category Pages**: Atmospheric header cards with category imagery and quick-filter pills.
- **Skeleton Loading States**: No jarring layout shifts (CLS) — smooth pulse skeletons during data fetches.

### 📦 Product Experience
- **Interactive Gallery**: Multi-angle product imagery with smooth thumbnail switching.
- **Color & Size Variants**: Live selection state with tactile feedback.
- **Quantity Selector**: Enforced bounds with real-time stock alert indicators.
- **3-Card Technical Specifications**: Clear, legible, high-contrast breakdown:
  1. *General Info*: Category (Title Case with direct link), Brand, SKU, and Availability.
  2. *Dimensions & Weight*: Width, Height, Depth, Item Weight, and Minimum Order bounds.
  3. *Shipping & Policies*: Real shipping transit estimates, warranty coverage, returns policy, and barcode (EAN).
- **Customer Reviews**: Verified buyer ratings with real feedback and dates.
- **You May Also Like**: Context-aware related products from the same department.

### 🛒 Smooth Cart & Wishlist
- **Fly-to-Cart Animation**: Adding an item sends a floating thumbnail along a parabolic trajectory right into the cart badge with a satisfying bounce effect (powered by the native Web Animations API).
- **Unobtrusive Shopping**: Adding an item doesn't hijack your screen or force drawers open — you stay in your shopping flow.
- **Quick Slide-Over Drawer**: Peek at your cart items anytime with a single click.
- **Dedicated Cart Page**: Itemized summary, quantity adjustments, and a **Free Shipping Progress Bar** ($75 threshold).
- **Promo Codes**: Interactive discounts (`SAVE10` for 10% off, `SAVE20` for 20% off).
- **Persistent Wishlist**: Save favorite items with one tap, saved locally and ready to move to cart in bulk.

### 💳 Checkout & Order Tracking
- **Multi-Method Payment Selector**:
  - 💳 **Credit / Debit Card**: Form with live format validation.
  - 🅿️ **PayPal Express**: One-click PayPal checkout panel.
  - 🍏 **Apple Pay**: Biometric simulated checkout with official badges.
  - 💵 **Cash on Delivery (COD)**: Pay upon doorstep delivery.
- **Instant Order Tracking**: Placing an order immediately redirects to your personal tracking page (`/account/orders/[id]`).
- **4-Step Live Shipment Timeline**: Track orders from *Confirmed* → *Processing* → *Shipped* → *Delivered* with carrier tracking numbers.

### 👤 Accounts & Authentication
- **1-Click Demo Login**: Pre-filled test credentials (e.g., Emily Johnson) so you can test authenticated flows instantly without registering.
- **Order History**: Filter previous orders by status (*All*, *Processing*, *Shipped*, *Delivered*).

---

## 🛠️ The Tech Stack (Explained Simply)

| Technology | What it does in Shopless |
|---|---|
| **Next.js 16 (App Router)** | Powers server-side rendering (SSR), dynamic routing (`/products/[slug]`), metadata generation, and blazing-fast Turbopack compilation. |
| **React 19** | The latest React core with concurrent rendering, server components, and streamlined state hooks. |
| **TypeScript** | Strict typing across all product models, orders, cart items, and API responses for rock-solid reliability. |
| **Tailwind CSS v4** | Next-generation CSS engine using CSS variables and modern OKLCH color palettes with zero runtime overhead. |
| **shadcn/ui & Base UI** | Accessible, unstyled UI primitives customized with shop tokens (Sheets, Tabs, Badges, Separators, Dialogs). |
| **Zustand 5** | Lightweight, boilerplate-free state management for Cart, Wishlist, Auth, and Orders with automatic `localStorage` persistence. |
| **Sonner** | Modern toast notifications positioned at `top-center` so they never block buttons or primary CTAs. |
| **Lucide Icons** | Clean, consistent, lightweight SVG iconography. |
| **next-themes** | Flawless Dark / Light theme switching with zero flash on page load. |
| **DummyJSON API** | Supplies real products, categories, reviews, prices, and demo authentication. |

---

## 📁 Project Structure

```text
shopless/
├── app/                         # Next.js App Router (Pages & Layouts)
│   ├── account/                 # User dashboard, orders list & tracking
│   ├── cart/                    # Full itemized shopping cart page
│   ├── categories/              # Category directory & category detail pages
│   ├── checkout/                # Multi-payment checkout & success confirmation
│   ├── products/                # Product catalog & [slug] detail pages
│   ├── wishlist/                # Saved items page
│   ├── layout.tsx               # Root layout (Navbar, CartSheet, Toaster, Footer)
│   └── globals.css              # Tailwind v4 theme variables & keyframe animations
├── components/                  # Reusable React components
│   ├── cart/                    # Cart sheet drawer & items
│   ├── home/                    # Hero slider, promo banners, category grids
│   ├── layout/                  # Navbar, mobile navigation, footer, theme toggle
│   ├── product/                 # Product cards, gallery, rating, filters, actions
│   └── ui/                      # shadcn UI components (button, badge, sheet, tabs...)
├── lib/                         # Core utilities & API client
│   ├── api/                     # DummyJSON client (products, categories, auth)
│   ├── hooks/                   # Custom hooks (useMounted for SSR hydration safety)
│   └── utils/                   # Formatters (currency, dates) & fly-to-cart physics
├── store/                       # Zustand persistent state stores
│   ├── cart-store.ts            # Cart items, promo codes, totals calculation
│   ├── wishlist-store.ts        # Saved favorite products
│   ├── auth-store.ts            # User session & credentials
│   └── order-store.ts           # Order history, timeline, & local persistence
└── types/                       # TypeScript interfaces (Product, Order, Cart, User)
```

---

## ⚡ Getting Started Locally

### Prerequisites
Make sure you have Node.js (v18+) and pnpm (or npm) installed:
```bash
node -v
pnpm -v
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/z3i0/shopless.git
   cd shopless
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm run dev
   ```

4. **Open in your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to see Shopless live!

### Production Build
To test the production build locally:
```bash
pnpm run build
pnpm run start
```

---

## 🔑 Demo Login Credentials

You can log in to test orders, account management, and profile features using the one-click demo button on `/login`, or manually:

- **Username**: `emilys`
- **Password**: `emilyspass`

*(All authentication and order workflows simulate a real backend with persistent browser storage, meaning your test orders and cart items stay saved across page refreshes).*

---

## 🎨 Design Principles

1. **Token Consistency**: All colors derive from CSS variables (`bg-card`, `border-border`, `text-primary`, `bg-muted`) ensuring full Dark & Light mode parity.
2. **Thumb-Friendly Mobile UX**: Action buttons and interactive elements follow a 48px touch target scale, tested down to 375px mobile viewports.
3. **Zero AI Gimmicks**: Clean, honest e-commerce interfaces — no random sparkles, no fake badges, and no noisy clutter.
4. **Hydration Safe**: Client-side storage (`localStorage`) is safely read post-mount with `useMounted` to eliminate React hydration mismatch errors.

---

## 📄 License & Credits

This project is open-source and proudly distributed under the [MIT License](LICENSE).

<br />

<div align="center">

  Designed & crafted with ❤️ and care by **[Ziad](https://github.com/z3i0)**

  *Dedicated to building clean, accessible, and delight-driven web experiences.*

</div>
