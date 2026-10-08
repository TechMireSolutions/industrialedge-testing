# Industrial Edge V2 - Backend Technical Specification & Architecture

**Document Version:** 2.0.0  
**Target Environment:** Production Node.js / Express REST API with PostgreSQL  
**System Status:** Greenfield Architecture Designed & Fully Implemented  

---

## 1. Executive Summary & Architecture Overview

The **Industrial Edge V2 Backend** is an enterprise-grade, high-throughput REST API engineered with Node.js, Express, and PostgreSQL. It delivers an asynchronous, non-blocking architecture specifically tailored for heavy B2B and corporate procurement workflows, real-time inventory synchronization, dynamic pricing tiers, and automated document generation (quotes & invoices).

```
                      +---------------------------------------+
                      |   Next.js Modular Frontend (Client)   |
                      +---------------------------------------+
                                          |
                                    HTTPS / REST
                                          |
                                          v
+---------------------------------------------------------------------------------+
|                       INDUSTRIAL EDGE V2 BACKEND ENGINE                         |
|                                                                                 |
|  +--------------------+  +----------------------+  +-------------------------+  |
|  | Security & Guard   |  | Business Logic       |  | Document & Asset Engine |  |
|  | - Helmet & CORS    |  | - Products & SKU Gen |  | - Sharp WebP Pipeline   |  |
|  | - JWT Bearer Auth  |  | - Dynamic SEO Slugs  |  | - PDFKit Quotation Gen  |  |
|  | - Granular RBAC    |  | - B2B Volume Pricing |  | - CSV Import / Export   |  |
|  | - Rate Limiting    |  | - Shipping Matrix    |  | - Cloudflare CDN Bridge |  |
|  +--------------------+  +----------------------+  +-------------------------+  |
|                                          |                                      |
+------------------------------------------|--------------------------------------+
                                           v
                       +---------------------------------------+
                       |        PostgreSQL Database (ACID)     |
                       |  - Connection Pooling (pg.Pool)       |
                       |  - Automated Timestamp Triggers       |
                       |  - Strict Referential Integrity       |
                       |  - Strategic Catalog Indexes          |
                       +---------------------------------------+
```

---

## 2. Greenfield Technical Stack

| Layer | Technology | Specifications & Rationale |
| :--- | :--- | :--- |
| **Runtime & Framework** | Node.js (v18+) + Express | High-throughput asynchronous event loop, non-blocking I/O, modular controller-service routing. |
| **Database** | PostgreSQL 15/16 | Strict ACID compliance, foreign key constraints (`ON DELETE RESTRICT/CASCADE`), JSONB support, connection pooling via `pg.Pool`. |
| **Authentication & Security** | JWT (jsonwebtoken) + bcryptjs | Stateless Bearer token authorization, salted password hashing, Role-Based Access Control (RBAC) with granular operational permissions. |
| **Asset Pipeline** | Sharp + Cloudflare CDN Bridge | Pre-upload image optimization converting JPEG/PNG/WebP into compressed `.webp` with stripped EXIF and CDN base URL mapping. |
| **Bulk Processing** | csv-parse & csv-stringify | Transactional catalog CSV imports with row validation, atomic rollbacks on DB failure, and catalog CSV exports. |
| **PDF Generation Engine** | PDFKit | High-definition corporate PDF quotations and commercial tax invoices with STRN/NTN tax credits and automated calculations. |

---

## 3. Database Schema Specification (PostgreSQL)

### 3.1 Core Entity Relationship Map
- **`roles` & `permissions` & `role_permissions`**: Hierarchical RBAC assigning operational permissions to store staff roles (Super Admin, Catalog Manager, Logistics Coordinator, Sales Representative).
- **`admin_users`**: Store managers and administrators authenticated via JWT.
- **`categories` & `subcategories` & `tags`**: Hierarchical classification with icons and display ordering.
- **`products`**: Central catalog entity featuring automated SKU triggers, SEO slug overrides, pricing, inventory thresholds, and JSONB specifications.
- **`product_images`**: Multi-image gallery with primary thumbnail indicators and WebP paths.
- **`inventory_logs`**: Immutable audit log recording every inventory increase, sale, manual adjustment, or return.
- **`currencies`**: Centralized multi-currency matrix (exchange rates, formatting tokens, active/default toggles).
- **`shipping_rules`**: Regional delivery pricing matrix with free shipping threshold conditions.
- **`b2b_price_tiers`**: Volume-based tiered discount engine linked to products or whole categories.
- **`cms_banners` & `cms_corporate_sections` & `cms_faqs` & `cms_policy_pages`**: Admin-managed CMS blocks.
- **`customers`**: Centralized account and purchase ledger recording lifetime order count and total spend.
- **`orders` & `order_items` & `order_status_history`**: Complete order fulfillment lifecycle.
- **`rfqs` & `rfq_items`**: Corporate Request for Quote hub supporting item-level price adjustments.
- **`global_settings`**: Key-value JSONB repository for SEO defaults and checkout field toggles (e.g. no zip code).

### 3.2 Automated Triggers & Performance Indexes
- **Automated Timestamp Trigger**: `update_timestamp_column()` automatically keeps `updated_at = CURRENT_TIMESTAMP` across all tables.
- **Catalog Performance Indexes**:
  - `idx_products_slug` ON `products(slug)`
  - `idx_products_sku` ON `products(sku)`
  - `idx_products_category` ON `products(category_id)`
  - `idx_products_status` ON `products(is_active, in_stock)`
  - `idx_orders_number` ON `orders(order_number)`
  - `idx_rfqs_number` ON `rfqs(rfq_number)`
  - `idx_customers_email` ON `customers(email)`

---

## 4. Complete API Route Map

All endpoints are mounted under the unified `/api/v1` namespace.

### 4.1 Authentication & Staff RBAC
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Admin login with email & password; returns JWT token & assigned permissions. |
| `GET` | `/api/v1/auth/me` | Authenticated | Get current authenticated administrator profile and active permissions. |
| `POST` | `/api/v1/auth/change-password`| Authenticated | Change admin account password. |
| `GET` | `/api/v1/rbac/roles` | `users:manage` | List all staff roles with assigned permissions. |
| `POST` | `/api/v1/rbac/roles` | Super Admin | Create a new staff role and bind operational permissions. |
| `GET` | `/api/v1/rbac/permissions` | `users:manage` | List all available operational permissions. |
| `GET` | `/api/v1/rbac/staff` | `users:manage` | List all admin staff accounts. |
| `POST` | `/api/v1/rbac/staff` | Super Admin | Provision a new staff user with designated role. |
| `PATCH`| `/api/v1/rbac/staff/:id` | Super Admin | Update staff user role or toggle active status. |

### 4.2 Product & Inventory Engine
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/products` | Public | List products with pagination, category filter, stock status, search, and sorting. |
| `GET` | `/api/v1/products/:id` | Public | Retrieve product details with image gallery and B2B pricing tiers. |
| `GET` | `/api/v1/products/slug/:slug` | Public | Retrieve product by SEO slug. |
| `GET` | `/api/v1/products/triggers/sku` | Authenticated | Trigger auto-generation of unique SKU prefix. |
| `GET` | `/api/v1/products/triggers/slug` | Authenticated | Trigger dynamic SEO slug normalization with collision checking. |
| `POST` | `/api/v1/products` | `products:create` | Create a new product (auto SKU and SEO slug if omitted). |
| `PUT` | `/api/v1/products/:id` | `products:update` | Update product details, pricing, inventory, and dynamic slug. |
| `POST` | `/api/v1/products/:id/duplicate`| `products:create`| Duplicate existing product with new unique SKU and slug. |
| `DELETE`| `/api/v1/products/:id` | `products:delete` | Delete product and clean up associated galleries. |
| `GET` | `/api/v1/inventory/low-stock` | `inventory:read` | List all products that have fallen below low-stock threshold. |
| `POST` | `/api/v1/inventory/adjust` | `inventory:adjust`| Adjust product stock with audit logging and reference ID. |
| `GET` | `/api/v1/inventory/logs` | `inventory:read` | Retrieve immutable inventory audit trails. |
| `POST` | `/api/v1/csv/import` | `products:bulk` | Transactional bulk CSV catalog upload with validation. |
| `GET` | `/api/v1/csv/export` | `products:read` | Export complete catalog as downloadable CSV file. |
| `POST` | `/api/v1/media/upload` | `products:update` | Upload media, convert to WebP, and attach to product gallery. |
| `DELETE`| `/api/v1/media/image/:imageId` | `products:update` | Remove image from product gallery. |

### 4.3 Categories, Subcategories & Tags
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/categories` | Public | List categories with subcategories and product counts. |
| `GET` | `/api/v1/categories/:id` | Public | Get single category details. |
| `POST` | `/api/v1/categories` | `products:create` | Create category. |
| `PUT` | `/api/v1/categories/:id` | `products:update` | Update category name, slug, or display order. |
| `DELETE`| `/api/v1/categories/:id` | `products:delete` | Delete category (restricted if products are assigned). |
| `POST` | `/api/v1/categories/subcategories`| `products:create`| Create subcategory. |
| `DELETE`| `/api/v1/categories/subcategories/:id`| `products:delete`| Delete subcategory. |
| `GET` | `/api/v1/categories/tags/all` | Public | List all catalog tags. |
| `POST` | `/api/v1/categories/tags` | `products:create` | Create a new tag. |

### 4.4 Dynamic Pricing & Shipping Matrix
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/pricing/currencies` | Public | List supported currencies and exchange rates. |
| `POST` | `/api/v1/pricing/currencies` | `pricing:manage` | Create or update currency, default status, or formatting token. |
| `GET` | `/api/v1/pricing/convert` | Public | Convert base PKR amount to target currency. |
| `GET` | `/api/v1/pricing/calculate` | Public | Dynamic B2B volume pricing calculator for given quantity. |
| `GET` | `/api/v1/pricing/b2b-tiers` | `pricing:manage` | List all configured volume discount tiers. |
| `POST` | `/api/v1/pricing/b2b-tiers` | `pricing:manage` | Create a new B2B quantity discount tier. |
| `DELETE`| `/api/v1/pricing/b2b-tiers/:id` | `pricing:manage` | Remove a B2B discount tier. |
| `GET` | `/api/v1/shipping/rules` | Public | List regional delivery shipping rules. |
| `POST` | `/api/v1/shipping/rules` | `shipping:manage`| Create or update regional shipping rule with free shipping thresholds. |
| `DELETE`| `/api/v1/shipping/rules/:id` | `shipping:manage`| Delete regional shipping rule. |
| `POST` | `/api/v1/shipping/calculate` | Public | Calculate cart shipping fee considering regional rates & product freight fees. |

### 4.5 Site Content & CMS Control
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/cms/banners` | Public | List active banners, hero sliders, and announcement bars. |
| `POST` | `/api/v1/cms/banners` | `cms:manage` | Create banner with title, badges, links, and display order. |
| `PUT` | `/api/v1/cms/banners/:id` | `cms:manage` | Update banner details or toggle active status. |
| `DELETE`| `/api/v1/cms/banners/:id` | `cms:manage` | Delete banner. |
| `GET` | `/api/v1/cms/corporate` | Public | Retrieve "For Corporate" / B2B landing page section blocks. |
| `PUT` | `/api/v1/cms/corporate/:sectionKey`| `cms:manage`| Update corporate page copy, features, and CTA blocks. |
| `GET` | `/api/v1/cms/faqs` | Public | List categorized FAQs. |
| `POST` | `/api/v1/cms/faqs` | `cms:manage` | Add FAQ item. |
| `PUT` | `/api/v1/cms/faqs/:id` | `cms:manage` | Update FAQ question, answer, or category. |
| `DELETE`| `/api/v1/cms/faqs/:id` | `cms:manage` | Remove FAQ item. |
| `GET` | `/api/v1/cms/policies` | Public | List published policy and static pages. |
| `GET` | `/api/v1/cms/policies/:slug` | Public | Get policy page by slug. |
| `POST` | `/api/v1/cms/policies` | `cms:manage` | Create or update policy page. |

### 4.6 Orders, RFQ Workflow & Customer Inspection
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/orders/checkout` | Public | Place order, reserve inventory, and register status history. |
| `GET` | `/api/v1/orders/track/:orderNumber`| Public | Live order tracking lookup with status timeline. |
| `GET` | `/api/v1/orders` | `orders:read` | List all orders with filters, search, and pagination. |
| `PATCH`| `/api/v1/orders/:id/status` | `orders:update` | Update order status (Processing, Shipped, Delivered, Cancelled) & trigger dispatch notice. |
| `GET` | `/api/v1/orders/:id/invoice.pdf`| `orders:read` | Generate and download official commercial tax invoice PDF. |
| `POST` | `/api/v1/rfq/submit` | Public | Submit corporate Request for Quote. |
| `GET` | `/api/v1/rfq` | `rfq:read` | List corporate RFQs with status filtering. |
| `GET` | `/api/v1/rfq/:id` | `rfq:read` | Get RFQ details and item specifications. |
| `PUT` | `/api/v1/rfq/:id/quote` | `rfq:manage` | Negotiate and update quoted unit prices and GST calculations. |
| `GET` | `/api/v1/rfq/:id/quotation.pdf`| `rfq:read` | Generate and download official corporate PDF quotation. |
| `POST` | `/api/v1/rfq/inquiry` | Public | Submit general contact inquiry. |
| `GET` | `/api/v1/rfq/inquiries/all` | `rfq:read` | List all customer inquiries. |
| `PATCH`| `/api/v1/rfq/inquiries/:id` | `rfq:manage` | Update inquiry status and reply notes. |
| `GET` | `/api/v1/customers` | `customers:read`| List customer accounts with total spend and order counts. |
| `GET` | `/api/v1/customers/:id` | `customers:read`| Deep inspection of customer purchase ledger and RFQ records. |

### 4.7 Global System & Configuration Settings
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/settings` | Public | Retrieve site-wide SEO metadata, checkout configurations, and company details. |
| `GET` | `/api/v1/settings/:group` | Public | Retrieve setting group ('seo', 'checkout', 'company'). |
| `PUT` | `/api/v1/settings/:group` | `settings:manage`| Update site-wide SEO meta, checkout fields (zip code validation toggle), or GST tax rules. |
| `GET` | `/api/v1/health` | Public | Real-time backend server uptime and PostgreSQL pool health check. |

---

## 5. Deployment & Execution Instructions

### Option 1: Docker Compose (Recommended for Production / Staging)
```bash
cd backend
docker-compose up -d --build
```
This automatically boots:
1. PostgreSQL 16 on port `5432` with auto-migration of `schema.sql`.
2. Industrial Edge V2 REST API on port `5000`.

### Option 2: Native Node.js Execution
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure `.env` with your PostgreSQL credentials.
3. Run Database Setup (Migrations + Seeding):
   ```bash
   npm run db:setup
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Run automated verification suite:
   ```bash
   npm run test
   ```

### Default Seeded Administrator Credentials
- **URL**: `http://localhost:5000/api/v1/auth/login`
- **Email**: `admin@industrialedge.pk`
- **Password**: `admin123`
- **Assigned Role**: `Super Admin` (Unrestricted operational privileges)
