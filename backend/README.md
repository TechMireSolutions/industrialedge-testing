# Industrial Edge V2 - Production Backend

High-throughput Express REST API and PostgreSQL database architecture for the Industrial Edge B2B & corporate procurement platform.

---

## Features Implemented

1. **Product & Inventory Engine**
   - Full CRUD for products, categories, subcategories, and tags.
   - Product duplication endpoint (`/api/v1/products/:id/duplicate`).
   - Automated SKU trigger generator (`IE-{CAT}-{SUB}-{RANDOM}`).
   - Dynamic SEO slug generator with automatic collision resolution.
   - Rich media galleries with primary image indicators.
   - Transactional bulk CSV imports & exports with validation and rollback on error.
   - Real-time inventory tracking, immutable audit logs, and low-stock threshold triggers (`/api/v1/inventory/low-stock`).

2. **Dynamic Pricing & Shipping Matrix**
   - Multi-currency controls (PKR, USD, EUR, AED) with real-time conversion and symbol formatting tokens.
   - Granular shipping rules engine with regional delivery overrides (Karachi Metro, Sindh Interior, Punjab/ICT, KPK/Balochistan) and free shipping thresholds.
   - Tiered B2B volume pricing matrix with discount percentage or custom unit price calculations.

3. **Site Content & CMS Control**
   - Visual banner, hero slider, and announcement bar management.
   - Corporate / B2B landing page section editor (`hero`, `features`, `procurement`).
   - FAQs CRUD with categorized grouping.
   - Policy pages manager (`terms-and-conditions`, `privacy-policy`).

4. **Order & RFQ Workflow Hub**
   - Order processing pipeline with live public tracking lookup (`/api/v1/orders/track/:orderNumber`).
   - Manual status transitions (Pending -> Confirmed -> Processing -> Shipped -> Delivered -> Cancelled) with automatic inventory restock on cancellation.
   - Asynchronous dispatch email notification logger.
   - Corporate RFQ Hub with line item negotiation, custom quoted unit prices, and status tracking.
   - Official Corporate PDF Quotation and Commercial Tax Invoice generator with NTN/STRN tax calculations.
   - Customer inspection repository tracking purchase histories and RFQ records.

5. **Global System & Configuration Settings**
   - Site-wide SEO title tags, meta descriptions, and OpenGraph controls.
   - Checkout customization (toggle optional/required checkout fields such as zip code validation).
   - Role-Based Access Control (RBAC) with granular operational permissions (Super Admin, Catalog Manager, Logistics Coordinator, Sales Rep).

---

## Quick Start

### 1. Configure Environment
```bash
cp .env.example .env
```

### 2. Run with Docker Compose
```bash
docker-compose up -d --build
```
PostgreSQL will run on port `5432` and the API will run on `http://localhost:5000`.

### 3. Or Run Locally
```bash
npm install
npm run db:setup
npm run dev
```

### 4. Run Automated Tests
```bash
npm run test
```

### Default Admin Credentials
- **Email:** `admin@industrialedge.pk`
- **Password:** `admin123`
- **Role:** Super Admin

---

## Technical Documentation
For full API route maps, database schemas, and architectural diagrams, see:
[`docs/Industrial_Edge_V2_Backend_Technical_Specification_and_Architecture.md`](docs/Industrial_Edge_V2_Backend_Technical_Specification_and_Architecture.md)
