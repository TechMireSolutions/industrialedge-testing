import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import type sqlite3 from "sqlite3";
import type { Database } from "sqlite";
import { Product, PRODUCTS as initialProducts } from "@/data/products";

// Interfaces
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  companyName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  ntnNumber?: string;
  deliveryAddress: string;
  city: string;
  paymentMethod: string;
  poNumber?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Processing" | "Dispatched" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: "New" | "Read" | "In Review" | "Resolved";
  createdAt: string;
  replyNotes?: string;
}

export interface HeroDeal {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  price: number;
  originalPrice: number;
  image: string;
  slug: string;
  active: boolean;
  order: number;
  createdAt: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  lastLogin?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  announcementText: string;
  announcementActive: boolean;
  gstPercentage: number;
  footerAbout?: string;
  workingHours?: string;
  copyrightText?: string;
  socialLinkedin?: string;
  socialFacebook?: string;
  socialWhatsapp?: string;
  socialInstagram?: string;
  headerLocation?: string;
  topBannerTag?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  robotsIndex?: boolean;
  canonicalUrl?: string;
  requireZipCode?: boolean;
  requireNtnNumber?: boolean;
  requirePoNumber?: boolean;
  allowGuestCheckout?: boolean;
  taxInclusive?: boolean;
}

export interface RfqItem {
  productId?: string;
  name: string;
  sku?: string;
  quantity: number;
  unit: string;
  targetBudget?: number;
  quotedUnitPrice?: number;
  quotedSubtotal?: number;
  notes?: string;
}

export interface Rfq {
  id: string;
  rfqNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  ntnNumber?: string;
  deliveryLocation: string;
  requiredByDate?: string;
  status: "Submitted" | "Under Review" | "Quoted" | "Approved" | "Rejected";
  notes?: string;
  items: RfqItem[];
  subtotalOffered?: number;
  gstAmount?: number;
  totalOffered?: number;
  assignedSales?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  phone: string;
  ntnNumber?: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpend: number;
  createdAt: string;
}

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  isActive: boolean;
  formatToken: string;
}

export interface ShippingRuleItem {
  id: string;
  regionName: string;
  baseFlatRate: number;
  freeShippingThreshold: number;
  estimatedDeliveryDays: string;
  isActive: boolean;
}

export interface B2BPriceTierItem {
  id: string;
  productId?: string;
  productName?: string;
  minQuantity: number;
  maxQuantity?: number;
  discountPercentage: number;
  customUnitPrice?: number;
  isActive: boolean;
}

export interface CmsFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

export interface CmsPolicyItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
  updatedAt: string;
}

export interface CmsCorporateSection {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  features: string[];
}

export interface RolePermissionItem {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  subcategories?: string[];
  productCount?: number;
}

export interface PricingShippingData {
  currencies: CurrencyItem[];
  shippingRules: ShippingRuleItem[];
  b2bTiers: B2BPriceTierItem[];
}

export interface CmsBrandsSection {
  heading: string;
  active: boolean;
  logos: string[];
}

export interface CmsStudioData {
  corporate: CmsCorporateSection;
  faqs: CmsFaqItem[];
  policies: CmsPolicyItem[];
  brands?: CmsBrandsSection;
}

export interface RbacData {
  roles: RolePermissionItem[];
  staff: { id: string; name: string; email: string; role: string; active: boolean; createdAt: string }[];
}

// Database Connection Singleton
let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;
let initPromise: Promise<void> | null = null;

export function getDbPath(): string {
  const custom = process.env.SQLITE_DB_PATH;
  if (custom) {
    return path.isAbsolute(custom) ? custom : path.resolve(/*turbopackIgnore: true*/ process.cwd(), custom);
  }
  return path.join(process.cwd(), "data", "industrial_edge.sqlite");
}

export async function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const dbPath = getDbPath();
      const dbDir = path.dirname(dbPath);
      await fs.mkdir(dbDir, { recursive: true });

      const sqlite3Module = await import("sqlite3");
      const sqliteModule = await import("sqlite");
      const sqlite3Driver = (sqlite3Module.default || sqlite3Module) as unknown as typeof sqlite3;
      const openDb = sqliteModule.open;

      const db = await openDb({
        filename: dbPath,
        driver: sqlite3Driver.Database,
      });

      await db.run("PRAGMA busy_timeout = 15000;");
      await db.run("PRAGMA journal_mode = WAL;");
      await db.run("PRAGMA foreign_keys = ON;");
      return db;
    })();
  }
  return dbPromise;
}

// Helper to safely read legacy JSON files during migration
async function readLegacyJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const legacyPath = path.join(process.cwd(), "data", "db", filename);
    const content = await fs.readFile(legacyPath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

// Database Initializer & Migration
export async function initDb(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = await getDb();

    // 1. Create Tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        originalPrice REAL,
        rating REAL DEFAULT 5.0,
        reviewsCount INTEGER DEFAULT 0,
        inStock INTEGER DEFAULT 1,
        isFeatured INTEGER DEFAULT 0,
        isNew INTEGER DEFAULT 0,
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        specifications TEXT,
        minOrderQty INTEGER DEFAULT 1,
        unit TEXT DEFAULT 'Piece',
        createdAt TEXT,
        updatedAt TEXT
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        icon TEXT DEFAULT 'FolderTree',
        description TEXT DEFAULT '',
        subcategories TEXT DEFAULT '[]'
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        orderNumber TEXT NOT NULL UNIQUE,
        companyName TEXT,
        contactPerson TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        ntnNumber TEXT,
        deliveryAddress TEXT NOT NULL,
        city TEXT NOT NULL,
        paymentMethod TEXT NOT NULL,
        poNumber TEXT,
        notes TEXT,
        items TEXT NOT NULL,
        subtotal REAL NOT NULL,
        gstAmount REAL NOT NULL,
        totalAmount REAL NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rfqs (
        id TEXT PRIMARY KEY,
        rfqNumber TEXT NOT NULL UNIQUE,
        companyName TEXT NOT NULL,
        contactPerson TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        ntnNumber TEXT,
        deliveryLocation TEXT NOT NULL,
        requiredByDate TEXT,
        status TEXT NOT NULL,
        notes TEXT,
        items TEXT NOT NULL,
        subtotalOffered REAL,
        gstAmount REAL,
        totalOffered REAL,
        assignedSales TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        service TEXT,
        message TEXT NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        replyNotes TEXT
      );

      CREATE TABLE IF NOT EXISTS deals (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        badge TEXT NOT NULL,
        price REAL NOT NULL,
        originalPrice REAL NOT NULL,
        image TEXT NOT NULL,
        slug TEXT NOT NULL,
        active INTEGER DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        fullName TEXT NOT NULL,
        companyName TEXT,
        phone TEXT NOT NULL,
        ntnNumber TEXT,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        totalOrders INTEGER DEFAULT 0,
        totalSpend REAL DEFAULT 0,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        lastLogin TEXT
      );

      CREATE TABLE IF NOT EXISTS app_config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // 2. Seed / Migrate Products
    const prodCount = (await db.get<{ count: number }>("SELECT count(*) as count FROM products"))?.count || 0;
    if (prodCount === 0) {
      const legacyProducts = await readLegacyJson<Product[]>("products.json", initialProducts);
      const items = legacyProducts.length > 0 ? legacyProducts : initialProducts;
      for (const p of items) {
        await db.run(
          `INSERT OR IGNORE INTO products (
            id, name, slug, category, price, originalPrice, rating, reviewsCount,
            inStock, isFeatured, isNew, image, description, specifications, minOrderQty, unit, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.id,
            p.name,
            p.slug,
            p.category,
            Number(p.price || 0),
            p.originalPrice != null ? Number(p.originalPrice) : null,
            Number(p.rating || 5.0),
            Number(p.reviewsCount || 0),
            p.inStock ? 1 : 0,
            p.isFeatured ? 1 : 0,
            p.isNew ? 1 : 0,
            p.image || "/uploads/2025/03/200.png",
            p.description || "",
            JSON.stringify(p.specifications || {}),
            Number(p.minOrderQty || 1),
            p.unit || "Piece",
            new Date().toISOString(),
            new Date().toISOString(),
          ]
        );
      }
    }

    // 3. Seed / Migrate Categories
    const catCount = (await db.get<{ count: number }>("SELECT count(*) as count FROM categories"))?.count || 0;
    if (catCount === 0) {
      const fallbackCats: CategoryItem[] = [
        { id: "electronic-appliances", name: "Electronics & IT Gear", slug: "electronic-appliances", icon: "Cpu", description: "Industrial computing, measurement electronics, and IT gear." },
        { id: "hardware-tools", name: "Hardware & Tools", slug: "hardware-tools", icon: "Wrench", description: "Heavy-duty power tools, mechanics sets, and workshop equipment." },
        { id: "office-supplies", name: "Office & Stationery", slug: "office-supplies", icon: "Briefcase", description: "Corporate stationery, paper supplies, and office ergonomics." },
        { id: "safety-equipment", name: "Safety Gear (PPE)", slug: "safety-equipment", icon: "HardHat", description: "Certified head protection, high-visibility apparel, and safety footwear." },
        { id: "industrial-chemicals", name: "Chemicals & Lubricants", slug: "industrial-chemicals", icon: "FlaskConical", description: "Specialized lubricants, degreasers, and industrial compounds." },
        { id: "electrical-components", name: "Electrical & Cabling", slug: "electrical-components", icon: "Zap", description: "Industrial circuit breakers, contactors, switchgear, and cabling." },
      ];
      const legacyCats = await readLegacyJson<CategoryItem[]>("categories.json", fallbackCats);
      for (const cat of legacyCats) {
        await db.run(
          `INSERT OR IGNORE INTO categories (id, name, slug, icon, description, subcategories)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            cat.id,
            cat.name,
            cat.slug,
            cat.icon || "FolderTree",
            cat.description || "",
            JSON.stringify(cat.subcategories || []),
          ]
        );
      }
    }

    // 4. Seed / Migrate Admin User
    const adminCount = (await db.get<{ count: number }>("SELECT count(*) as count FROM admin_users"))?.count || 0;
    if (adminCount === 0) {
      const defaultPasswordHash = await bcrypt.hash("admin123", 10);
      const defaultAdmins: AdminAccount[] = [
        {
          id: "admin-1",
          email: "admin@industrialedge.pk",
          passwordHash: defaultPasswordHash,
          name: "Head Administrator",
          role: "Super Admin",
        },
      ];
      const legacyAdmins = await readLegacyJson<AdminAccount[]>("admin.json", defaultAdmins);
      for (const a of legacyAdmins) {
        await db.run(
          `INSERT OR IGNORE INTO admin_users (id, email, passwordHash, name, role, lastLogin)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [a.id, a.email, a.passwordHash, a.name, a.role, a.lastLogin || null]
        );
      }
    }

    // 5. Seed / Migrate Orders
    const orderCount = (await db.get<{ count: number }>("SELECT count(*) as count FROM orders"))?.count || 0;
    if (orderCount === 0) {
      const legacyOrders = await readLegacyJson<Order[]>("orders.json", []);
      for (const o of legacyOrders) {
        await db.run(
          `INSERT OR IGNORE INTO orders (
            id, orderNumber, companyName, contactPerson, email, phone, ntnNumber,
            deliveryAddress, city, paymentMethod, poNumber, notes, items, subtotal,
            gstAmount, totalAmount, status, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            o.id,
            o.orderNumber,
            o.companyName || "",
            o.contactPerson,
            o.email,
            o.phone,
            o.ntnNumber || "",
            o.deliveryAddress,
            o.city || "Karachi",
            o.paymentMethod || "bank-transfer",
            o.poNumber || "",
            o.notes || "",
            JSON.stringify(o.items || []),
            Number(o.subtotal || 0),
            Number(o.gstAmount || 0),
            Number(o.totalAmount || 0),
            o.status || "Pending",
            o.createdAt || new Date().toISOString(),
            o.updatedAt || new Date().toISOString(),
          ]
        );
      }
    }

    // 6. Seed / Migrate Inquiries
    const inqCount = (await db.get<{ count: number }>("SELECT count(*) as count FROM inquiries"))?.count || 0;
    if (inqCount === 0) {
      const legacyInquiries = await readLegacyJson<Inquiry[]>("inquiries.json", []);
      for (const i of legacyInquiries) {
        await db.run(
          `INSERT OR IGNORE INTO inquiries (id, name, email, phone, company, service, message, status, createdAt, replyNotes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [i.id, i.name, i.email, i.phone || "", i.company || "", i.service || "", i.message, i.status, i.createdAt, i.replyNotes || ""]
        );
      }
    }

    // 7. Seed / Migrate Deals
    const dealCount = (await db.get<{ count: number }>("SELECT count(*) as count FROM deals"))?.count || 0;
    if (dealCount === 0) {
      const initialDeals: HeroDeal[] = initialProducts
        .filter((p) => p.isFeatured || (p.originalPrice && p.originalPrice > p.price))
        .slice(0, 4)
        .map((p, index) => ({
          id: `deal-${p.id}`,
          title: p.name,
          subtitle: p.description.slice(0, 100) + "...",
          badge: "Special Wholesale Offer",
          price: p.price,
          originalPrice: p.originalPrice || Math.round(p.price * 1.15),
          image: p.image,
          slug: p.slug,
          active: true,
          order: index + 1,
          createdAt: new Date().toISOString(),
        }));
      const legacyDeals = await readLegacyJson<HeroDeal[]>("deals.json", initialDeals);
      for (const d of legacyDeals) {
        await db.run(
          `INSERT OR IGNORE INTO deals (id, title, subtitle, badge, price, originalPrice, image, slug, active, display_order, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [d.id, d.title, d.subtitle, d.badge, d.price, d.originalPrice, d.image, d.slug, d.active ? 1 : 0, d.order || 0, d.createdAt]
        );
      }
    }

    // 8. Seed / Migrate RFQs
    const rfqCount = (await db.get<{ count: number }>("SELECT count(*) as count FROM rfqs"))?.count || 0;
    if (rfqCount === 0) {
      const initialRfqs: Rfq[] = [
        {
          id: "rfq-101",
          rfqNumber: "RFQ-82914",
          companyName: "Nishat Mills Limited (Corporate)",
          contactPerson: "Khurram Shahzad",
          email: "procurement@nishat.net",
          phone: "+92 321 8472910",
          ntnNumber: "0789214-5",
          deliveryLocation: "Nishat Textile Complex, 21km Ferozepur Road, Lahore",
          requiredByDate: "2026-11-15",
          status: "Under Review",
          notes: "Urgent delivery required for facility expansion. Requesting volume discount.",
          items: [
            {
              productId: "prod-1",
              name: "Heavy-Duty Brushless Cordless Impact Drill Kit 20V",
              sku: "IE-HAR-TOO-2001",
              quantity: 25,
              unit: "Kit",
              targetBudget: 22000,
              quotedUnitPrice: 22500,
              quotedSubtotal: 562500,
              notes: "Batteries must be certified twin 4.0Ah",
            },
            {
              productId: "prod-4",
              name: "Certified Industrial Safety Helmet with Ratchet Suspension (Class E)",
              sku: "IE-SAF-EQU-1004",
              quantity: 150,
              unit: "Piece",
              targetBudget: 1700,
              quotedUnitPrice: 1750,
              quotedSubtotal: 262500,
              notes: "Yellow color for assembly line workers",
            },
          ],
          subtotalOffered: 825000,
          gstAmount: 148500,
          totalOffered: 973500,
          assignedSales: "Head Administrator",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      const legacyRfqs = await readLegacyJson<Rfq[]>("rfqs.json", initialRfqs);
      for (const r of legacyRfqs) {
        await db.run(
          `INSERT OR IGNORE INTO rfqs (
            id, rfqNumber, companyName, contactPerson, email, phone, ntnNumber,
            deliveryLocation, requiredByDate, status, notes, items, subtotalOffered,
            gstAmount, totalOffered, assignedSales, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            r.id,
            r.rfqNumber,
            r.companyName,
            r.contactPerson,
            r.email,
            r.phone,
            r.ntnNumber || "",
            r.deliveryLocation,
            r.requiredByDate || "",
            r.status,
            r.notes || "",
            JSON.stringify(r.items || []),
            r.subtotalOffered != null ? Number(r.subtotalOffered) : null,
            r.gstAmount != null ? Number(r.gstAmount) : null,
            r.totalOffered != null ? Number(r.totalOffered) : null,
            r.assignedSales || "",
            r.createdAt,
            r.updatedAt,
          ]
        );
      }
    }

    // 9. Seed / Migrate Customers
    const custCount = (await db.get<{ count: number }>("SELECT count(*) as count FROM customers"))?.count || 0;
    if (custCount === 0) {
      const initialCustomers: CustomerRecord[] = [
        {
          id: "cust-1",
          email: "procurement@nishat.net",
          fullName: "Khurram Shahzad",
          companyName: "Nishat Mills Limited",
          phone: "+92 321 8472910",
          ntnNumber: "0789214-5",
          address: "21km Ferozepur Road",
          city: "Lahore",
          totalOrders: 3,
          totalSpend: 1850000,
          createdAt: new Date().toISOString(),
        },
        {
          id: "cust-2",
          email: "procure@engro.com",
          fullName: "Engr. Danish Qureshi",
          companyName: "Engro Polymer & Chemicals",
          phone: "+92 300 9283741",
          ntnNumber: "1482903-8",
          address: "Port Qasim Industrial Zone",
          city: "Karachi",
          totalOrders: 2,
          totalSpend: 2420000,
          createdAt: new Date().toISOString(),
        },
      ];
      const legacyCustomers = await readLegacyJson<CustomerRecord[]>("customers.json", initialCustomers);
      for (const c of legacyCustomers) {
        await db.run(
          `INSERT OR IGNORE INTO customers (id, email, fullName, companyName, phone, ntnNumber, address, city, totalOrders, totalSpend, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [c.id, c.email, c.fullName, c.companyName || "", c.phone, c.ntnNumber || "", c.address, c.city, c.totalOrders, c.totalSpend, c.createdAt]
        );
      }
    }

    // 10. Seed / Migrate App Configs (Settings, CMS, Pricing, RBAC)
    const settingsRow = await db.get("SELECT value FROM app_config WHERE key = 'settings'");
    if (!settingsRow) {
      const defaultSettings: SiteSettings = {
        siteName: "Industrial Edge",
        tagline: "Total Corporate & Industrial Procurement Solutions",
        phone: "+92 332 2316225",
        whatsapp: "923322316225",
        email: "info@industrialedge.pk",
        address: "Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan",
        googleMapsUrl: "https://maps.app.goo.gl/52dT7YxfarFZ4nPQ7",
        announcementText: "Corporate Discounts available on bulk annual contracts across Pakistan!",
        announcementActive: true,
        gstPercentage: 18,
        footerAbout: "From office essentials to industrial supplies, we're your trusted procurement partner across Pakistan. Simplifying supply chains with reliability, competitive pricing, and timely deliveries.",
        workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
        copyrightText: "© 2026 Industrial Edge. All rights reserved.",
        socialLinkedin: "https://linkedin.com/company/industrial-edge-pk",
        socialFacebook: "https://facebook.com/industrialedge.pk",
        socialWhatsapp: "https://wa.me/923322316225",
        socialInstagram: "https://instagram.com/industrialedge.pk",
        headerLocation: "Karachi Head Office | Nationwide Delivery",
        topBannerTag: "Direct Industrial Sourcing & Corporate Bulk Pricing",
        metaTitle: "Industrial Edge | Pakistan's Premier B2B MRO & Industrial Procurement",
        metaDescription: "Source certified industrial tools, safety PPE, automation components, and genuine bearings with verified NTN invoicing across Pakistan.",
        metaKeywords: "industrial equipment, MRO Pakistan, safety gear Karachi, tools wholesale, Siemens, Bosch, SKF",
        ogImage: "/banner.png",
        robotsIndex: true,
        canonicalUrl: "https://industrialedge.pk",
        requireZipCode: false,
        requireNtnNumber: true,
        requirePoNumber: false,
        allowGuestCheckout: true,
        taxInclusive: false,
      };
      const legacySettings = await readLegacyJson<SiteSettings>("settings.json", defaultSettings);
      await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('settings', ?)", [JSON.stringify(legacySettings)]);
    }

    const cmsRow = await db.get("SELECT value FROM app_config WHERE key = 'cms'");
    if (!cmsRow) {
      const defaultCms: CmsStudioData = {
        corporate: {
          title: "For Corporate & Industrial Procurement",
          subtitle: "Streamlined bulk procurement contracts, FBR verified NTN input tax credits, dedicated technical account management, and nationwide site dispatches.",
          ctaText: "Request Corporate Quotation (RFQ)",
          ctaLink: "/contact",
          features: [
            "Commercial Tax Invoices with verified NTN & STRN for corporate audits",
            "Tiered volume discount matrices for enterprise-scale procurements",
            "Nationwide dedicated freight logistics with on-site offloading support",
            "Corporate credit facilities (Net 30/60) for registered enterprises",
          ],
        },
        faqs: [
          { id: "faq-1", category: "B2B Procurement", question: "How do corporate purchase orders and NTN tax credits work?", answer: "We issue computerized commercial tax invoices containing full active STRN and NTN credentials, allowing corporate accounting departments to claim full sales tax input adjustments with the Federal Board of Revenue (FBR).", order: 1, active: true },
          { id: "faq-2", category: "Logistics & Delivery", question: "What are your delivery schedules across Pakistan?", answer: "Karachi Metro shipments are dispatched within 24 hours. Inter-city shipments across Sindh, Punjab, and KPK arrive within 2-4 business days via verified logistics haulers.", order: 2, active: true },
          { id: "faq-3", category: "Warranty & Support", question: "Do industrial tools and heavy equipment carry warranty?", answer: "All power equipment, HVAC systems, and precision instruments include standard 1 to 3 years corporate replacement warranty, backed by on-site technical inspection.", order: 3, active: true },
        ],
        policies: [
          { id: "pol-1", slug: "terms-and-conditions", title: "Corporate Procurement Terms & Conditions", content: "All purchases are subject to Industrial Edge formal quotation parameters, verified corporate PO submission, and agreed payment terms.", published: true, updatedAt: new Date().toISOString() },
          { id: "pol-2", slug: "privacy-policy", title: "Corporate Privacy & Data Protection", content: "Industrial Edge enforces strict encryption standards. Enterprise buyer data, transaction invoices, and RFQ pricing agreements are kept strictly confidential.", published: true, updatedAt: new Date().toISOString() },
        ],
        brands: {
          heading: "Supplying Products From Leading Industrial Brands",
          active: true,
          logos: [
            "/uploads/2025/02/1-1.png",
            "/uploads/2025/02/2-2.png",
            "/uploads/2025/02/3-1.png",
            "/uploads/2025/02/4-1.png",
            "/uploads/2025/02/5-2.png",
            "/uploads/2025/02/6-1.png",
            "/uploads/2025/02/7-1.png",
            "/uploads/2025/02/8-1.png",
            "/uploads/2025/02/9-1.png",
            "/uploads/2025/02/10-1.png",
            "/uploads/2025/02/11-1.png",
            "/uploads/2025/02/12-1.png",
            "/uploads/2025/02/13-1.png",
            "/uploads/2025/02/14.png",
            "/uploads/2025/02/15.png",
            "/uploads/2025/02/16.png",
            "/uploads/2025/02/17.png",
            "/uploads/2025/02/18.png",
            "/uploads/2025/02/19.png",
            "/uploads/2025/02/20.png",
            "/uploads/2025/02/21.png",
            "/uploads/2025/02/22.png",
            "/uploads/2025/02/23.png",
            "/uploads/2025/02/24.png",
          ],
        },
      };
      const legacyCms = await readLegacyJson<CmsStudioData>("cms.json", defaultCms);
      await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('cms', ?)", [JSON.stringify(legacyCms)]);
    }

    const pricingRow = await db.get("SELECT value FROM app_config WHERE key = 'pricing_shipping'");
    if (!pricingRow) {
      const defaultPricingShipping: PricingShippingData = {
        currencies: [
          { code: "PKR", name: "Pakistani Rupee", symbol: "Rs.", exchangeRate: 1.0, isDefault: true, isActive: true, formatToken: "{symbol} {amount}" },
          { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 280.0, isDefault: false, isActive: true, formatToken: "{symbol}{amount}" },
          { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 300.0, isDefault: false, isActive: true, formatToken: "{symbol}{amount}" },
          { code: "AED", name: "UAE Dirham", symbol: "AED", exchangeRate: 76.5, isDefault: false, isActive: true, formatToken: "{symbol} {amount}" },
        ],
        shippingRules: [
          { id: "ship-1", regionName: "Karachi Metro / Local Dispatch", baseFlatRate: 350, freeShippingThreshold: 30000, estimatedDeliveryDays: "Same Day / 24 Hours", isActive: true },
          { id: "ship-2", regionName: "Sindh Interior (Hyderabad, Sukkur, Larkana)", baseFlatRate: 650, freeShippingThreshold: 50000, estimatedDeliveryDays: "2-3 Business Days", isActive: true },
          { id: "ship-3", regionName: "Punjab & Islamabad / ICT", baseFlatRate: 850, freeShippingThreshold: 60000, estimatedDeliveryDays: "2-4 Business Days", isActive: true },
          { id: "ship-4", regionName: "KPK, Balochistan, AJK & Gilgit", baseFlatRate: 1200, freeShippingThreshold: 75000, estimatedDeliveryDays: "3-6 Business Days", isActive: true },
        ],
        b2bTiers: [
          { id: "tier-1", minQuantity: 5, maxQuantity: 19, discountPercentage: 5.0, isActive: true },
          { id: "tier-2", minQuantity: 20, maxQuantity: 49, discountPercentage: 10.0, isActive: true },
          { id: "tier-3", minQuantity: 50, discountPercentage: 18.0, isActive: true },
        ],
      };
      const legacyPricing = await readLegacyJson<PricingShippingData>("pricing_shipping.json", defaultPricingShipping);
      await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('pricing_shipping', ?)", [JSON.stringify(legacyPricing)]);
    }

    const rbacRow = await db.get("SELECT value FROM app_config WHERE key = 'rbac'");
    if (!rbacRow) {
      const defaultRbac: RbacData = {
        roles: [
          {
            id: "role-super-admin",
            name: "Super Admin",
            description: "Full master administrative control over catalog, pricing, orders, and system settings",
            permissions: ["products:all", "inventory:all", "orders:all", "rfq:all", "pricing:all", "cms:all", "settings:all", "users:all"],
          },
          {
            id: "role-catalog-mgr",
            name: "Catalog Manager",
            description: "Manages products, categories, SKU auto-generation, media galleries, and CSV imports",
            permissions: ["products:all", "inventory:all", "cms:all"],
          },
          {
            id: "role-logistics-coord",
            name: "Logistics Coordinator",
            description: "Handles order processing pipeline, dispatch status updates, and shipping rules",
            permissions: ["orders:all", "inventory:read", "pricing:read"],
          },
          {
            id: "role-sales-rep",
            name: "Sales Representative",
            description: "Inspects incoming RFQs, adjusts quoted pricing, and manages customer accounts",
            permissions: ["rfq:all", "orders:read", "customers:all"],
          },
        ],
        staff: [
          {
            id: "staff-1",
            name: "Head Administrator",
            email: "admin@industrialedge.pk",
            role: "Super Admin",
            active: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: "staff-2",
            name: "Asad Malik (Catalog Lead)",
            email: "asad@industrialedge.pk",
            role: "Catalog Manager",
            active: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: "staff-3",
            name: "Zainab Raza (B2B Sales Lead)",
            email: "zainab@industrialedge.pk",
            role: "Sales Representative",
            active: true,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      const legacyRbac = await readLegacyJson<RbacData>("rbac.json", defaultRbac);
      await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('rbac', ?)", [JSON.stringify(legacyRbac)]);
    }
  })();

  return initPromise;
}

// ================= ROW MAPPERS =================
function mapProductRow(row: any): Product {
  let specs: Record<string, string> = {};
  if (typeof row.specifications === "string") {
    try {
      specs = JSON.parse(row.specifications);
    } catch {
      specs = {};
    }
  } else if (typeof row.specifications === "object" && row.specifications !== null) {
    specs = row.specifications;
  }

  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    category: String(row.category),
    price: Number(row.price),
    originalPrice: row.originalPrice != null ? Number(row.originalPrice) : undefined,
    rating: Number(row.rating ?? 5.0),
    reviewsCount: Number(row.reviewsCount ?? 0),
    inStock: Boolean(row.inStock),
    isFeatured: Boolean(row.isFeatured),
    isNew: Boolean(row.isNew),
    image: String(row.image || "/uploads/2025/03/200.png"),
    description: String(row.description || ""),
    specifications: specs,
    minOrderQty: Number(row.minOrderQty ?? 1),
    unit: String(row.unit || "Piece"),
  };
}

function mapOrderRow(row: any): Order {
  let items: OrderItem[] = [];
  if (typeof row.items === "string") {
    try {
      items = JSON.parse(row.items);
    } catch {
      items = [];
    }
  } else if (Array.isArray(row.items)) {
    items = row.items;
  }

  return {
    id: String(row.id),
    orderNumber: String(row.orderNumber),
    companyName: row.companyName || undefined,
    contactPerson: String(row.contactPerson),
    email: String(row.email),
    phone: String(row.phone),
    ntnNumber: row.ntnNumber || undefined,
    deliveryAddress: String(row.deliveryAddress),
    city: String(row.city),
    paymentMethod: String(row.paymentMethod),
    poNumber: row.poNumber || undefined,
    notes: row.notes || undefined,
    items,
    subtotal: Number(row.subtotal),
    gstAmount: Number(row.gstAmount),
    totalAmount: Number(row.totalAmount),
    status: row.status as Order["status"],
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
  };
}

function mapRfqRow(row: any): Rfq {
  let items: RfqItem[] = [];
  if (typeof row.items === "string") {
    try {
      items = JSON.parse(row.items);
    } catch {
      items = [];
    }
  } else if (Array.isArray(row.items)) {
    items = row.items;
  }

  return {
    id: String(row.id),
    rfqNumber: String(row.rfqNumber),
    companyName: String(row.companyName),
    contactPerson: String(row.contactPerson),
    email: String(row.email),
    phone: String(row.phone),
    ntnNumber: row.ntnNumber || undefined,
    deliveryLocation: String(row.deliveryLocation),
    requiredByDate: row.requiredByDate || undefined,
    status: row.status as Rfq["status"],
    notes: row.notes || undefined,
    items,
    subtotalOffered: row.subtotalOffered != null ? Number(row.subtotalOffered) : undefined,
    gstAmount: row.gstAmount != null ? Number(row.gstAmount) : undefined,
    totalOffered: row.totalOffered != null ? Number(row.totalOffered) : undefined,
    assignedSales: row.assignedSales || undefined,
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
  };
}

function mapInquiryRow(row: any): Inquiry {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: row.phone || undefined,
    company: row.company || undefined,
    service: row.service || undefined,
    message: String(row.message),
    status: row.status as Inquiry["status"],
    createdAt: String(row.createdAt),
    replyNotes: row.replyNotes || undefined,
  };
}

function mapDealRow(row: any): HeroDeal {
  return {
    id: String(row.id),
    title: String(row.title),
    subtitle: String(row.subtitle),
    badge: String(row.badge),
    price: Number(row.price),
    originalPrice: Number(row.originalPrice),
    image: String(row.image),
    slug: String(row.slug),
    active: Boolean(row.active),
    order: Number(row.display_order ?? 0),
    createdAt: String(row.createdAt),
  };
}

function mapCustomerRow(row: any): CustomerRecord {
  return {
    id: String(row.id),
    email: String(row.email),
    fullName: String(row.fullName),
    companyName: row.companyName || undefined,
    phone: String(row.phone),
    ntnNumber: row.ntnNumber || undefined,
    address: String(row.address),
    city: String(row.city),
    totalOrders: Number(row.totalOrders || 0),
    totalSpend: Number(row.totalSpend || 0),
    createdAt: String(row.createdAt),
  };
}

function mapCategoryRow(row: any, productCount = 0): CategoryItem {
  let subcategories: string[] = [];
  if (typeof row.subcategories === "string") {
    try {
      subcategories = JSON.parse(row.subcategories);
    } catch {
      subcategories = [];
    }
  } else if (Array.isArray(row.subcategories)) {
    subcategories = row.subcategories;
  }

  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    icon: String(row.icon || "FolderTree"),
    description: row.description || "",
    subcategories,
    productCount,
  };
}

// ================= PRODUCT METHODS =================
export async function getProducts(): Promise<Product[]> {
  try {
    await initDb();
    const db = await getDb();
    const rows = await db.all("SELECT * FROM products ORDER BY rowid DESC");
    if (rows && rows.length > 0) {
      return rows.map(mapProductRow);
    }
  } catch (err) {
    console.warn("getProducts database fallback:", err);
  }
  return readLegacyJson<Product[]>("products.json", initialProducts);
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    await initDb();
    const db = await getDb();
    const row = await db.get("SELECT * FROM products WHERE id = ?", [id]);
    if (row) return mapProductRow(row);
  } catch (err) {
    console.warn("getProductById database fallback:", err);
  }
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await initDb();
    const db = await getDb();
    const row = await db.get("SELECT * FROM products WHERE slug = ?", [slug]);
    if (row) return mapProductRow(row);
  } catch (err) {
    console.warn("getProductBySlug database fallback:", err);
  }
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  await initDb();
  const db = await getDb();
  const id = `prod-${Date.now()}`;
  const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO products (
      id, name, slug, category, price, originalPrice, rating, reviewsCount,
      inStock, isFeatured, isNew, image, description, specifications, minOrderQty, unit, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      product.name,
      slug,
      product.category,
      Number(product.price || 0),
      product.originalPrice != null ? Number(product.originalPrice) : null,
      Number(product.rating || 5.0),
      Number(product.reviewsCount || 0),
      product.inStock ? 1 : 0,
      product.isFeatured ? 1 : 0,
      product.isNew ? 1 : 0,
      product.image || "/uploads/2025/03/200.png",
      product.description || "",
      JSON.stringify(product.specifications || {}),
      Number(product.minOrderQty || 1),
      product.unit || "Piece",
      now,
      now,
    ]
  );

  return (await getProductById(id))!;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  await initDb();
  const db = await getDb();
  const existing = await getProductById(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates, id };
  const now = new Date().toISOString();

  await db.run(
    `UPDATE products SET
      name = ?, slug = ?, category = ?, price = ?, originalPrice = ?,
      rating = ?, reviewsCount = ?, inStock = ?, isFeatured = ?, isNew = ?,
      image = ?, description = ?, specifications = ?, minOrderQty = ?, unit = ?, updatedAt = ?
    WHERE id = ?`,
    [
      merged.name,
      merged.slug,
      merged.category,
      Number(merged.price || 0),
      merged.originalPrice != null ? Number(merged.originalPrice) : null,
      Number(merged.rating || 5.0),
      Number(merged.reviewsCount || 0),
      merged.inStock ? 1 : 0,
      merged.isFeatured ? 1 : 0,
      merged.isNew ? 1 : 0,
      merged.image,
      merged.description,
      JSON.stringify(merged.specifications || {}),
      Number(merged.minOrderQty || 1),
      merged.unit,
      now,
      id,
    ]
  );

  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  await initDb();
  const db = await getDb();
  const res = await db.run("DELETE FROM products WHERE id = ?", [id]);
  return (res.changes || 0) > 0;
}

// ================= ORDER METHODS =================
export async function getOrders(): Promise<Order[]> {
  await initDb();
  const db = await getDb();
  const rows = await db.all("SELECT * FROM orders ORDER BY rowid DESC");
  return rows.map(mapOrderRow);
}

export async function getOrderById(id: string): Promise<Order | null> {
  await initDb();
  const db = await getDb();
  const row = await db.get("SELECT * FROM orders WHERE id = ? OR orderNumber = ?", [id, id]);
  return row ? mapOrderRow(row) : null;
}

export async function createOrder(data: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Promise<Order> {
  await initDb();
  const db = await getDb();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `IE-${randomSuffix}`;
  const now = new Date().toISOString();
  const id = `ord-${Date.now()}`;

  await db.run(
    `INSERT INTO orders (
      id, orderNumber, companyName, contactPerson, email, phone, ntnNumber,
      deliveryAddress, city, paymentMethod, poNumber, notes, items, subtotal,
      gstAmount, totalAmount, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      orderNumber,
      data.companyName || "",
      data.contactPerson,
      data.email,
      data.phone,
      data.ntnNumber || "",
      data.deliveryAddress,
      data.city || "Karachi",
      data.paymentMethod || "bank-transfer",
      data.poNumber || "",
      data.notes || "",
      JSON.stringify(data.items || []),
      Number(data.subtotal || 0),
      Number(data.gstAmount || 0),
      Number(data.totalAmount || 0),
      data.status || "Pending",
      now,
      now,
    ]
  );

  // Sync customer record automatically
  try {
    const existingCust = await db.get("SELECT * FROM customers WHERE lower(email) = lower(?)", [data.email]);
    if (existingCust) {
      await db.run(
        "UPDATE customers SET totalOrders = totalOrders + 1, totalSpend = totalSpend + ? WHERE id = ?",
        [Number(data.totalAmount || 0), existingCust.id]
      );
    } else {
      const custId = `cust-${Date.now()}`;
      await db.run(
        `INSERT INTO customers (id, email, fullName, companyName, phone, ntnNumber, address, city, totalOrders, totalSpend, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        [
          custId,
          data.email,
          data.contactPerson,
          data.companyName || "",
          data.phone,
          data.ntnNumber || "",
          data.deliveryAddress,
          data.city || "Karachi",
          Number(data.totalAmount || 0),
          now,
        ]
      );
    }
  } catch (custErr) {
    console.error("Auto customer sync error:", custErr);
  }

  return (await getOrderById(id))!;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
  await initDb();
  const db = await getDb();
  const now = new Date().toISOString();
  await db.run(
    "UPDATE orders SET status = ?, updatedAt = ? WHERE id = ? OR orderNumber = ?",
    [status, now, id, id]
  );
  return getOrderById(id);
}

export async function deleteOrder(id: string): Promise<boolean> {
  await initDb();
  const db = await getDb();
  const res = await db.run("DELETE FROM orders WHERE id = ? OR orderNumber = ?", [id, id]);
  return (res.changes || 0) > 0;
}

// ================= INQUIRY METHODS =================
export async function getInquiries(): Promise<Inquiry[]> {
  await initDb();
  const db = await getDb();
  const rows = await db.all("SELECT * FROM inquiries ORDER BY rowid DESC");
  return rows.map(mapInquiryRow);
}

export async function createInquiry(data: Omit<Inquiry, "id" | "status" | "createdAt">): Promise<Inquiry> {
  await initDb();
  const db = await getDb();
  const id = `inq-${Date.now()}`;
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO inquiries (id, name, email, phone, company, service, message, status, createdAt, replyNotes)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?, '')`,
    [id, data.name, data.email, data.phone || "", data.company || "", data.service || "", data.message, now]
  );

  const row = await db.get("SELECT * FROM inquiries WHERE id = ?", [id]);
  return mapInquiryRow(row);
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"], replyNotes?: string): Promise<Inquiry | null> {
  await initDb();
  const db = await getDb();
  if (replyNotes !== undefined) {
    await db.run("UPDATE inquiries SET status = ?, replyNotes = ? WHERE id = ?", [status, replyNotes, id]);
  } else {
    await db.run("UPDATE inquiries SET status = ? WHERE id = ?", [status, id]);
  }
  const row = await db.get("SELECT * FROM inquiries WHERE id = ?", [id]);
  return row ? mapInquiryRow(row) : null;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  await initDb();
  const db = await getDb();
  const res = await db.run("DELETE FROM inquiries WHERE id = ?", [id]);
  return (res.changes || 0) > 0;
}

// ================= DEALS METHODS =================
export async function getDeals(): Promise<HeroDeal[]> {
  await initDb();
  const db = await getDb();
  const rows = await db.all("SELECT * FROM deals ORDER BY display_order ASC");
  return rows.map(mapDealRow);
}

export async function createDeal(data: Omit<HeroDeal, "id" | "createdAt">): Promise<HeroDeal> {
  await initDb();
  const db = await getDb();
  const id = `deal-${Date.now()}`;
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO deals (id, title, subtitle, badge, price, originalPrice, image, slug, active, display_order, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.title, data.subtitle, data.badge, data.price, data.originalPrice, data.image, data.slug, data.active ? 1 : 0, data.order || 0, now]
  );

  const row = await db.get("SELECT * FROM deals WHERE id = ?", [id]);
  return mapDealRow(row);
}

export async function updateDeal(id: string, updates: Partial<HeroDeal>): Promise<HeroDeal | null> {
  await initDb();
  const db = await getDb();
  const existingRow = await db.get("SELECT * FROM deals WHERE id = ?", [id]);
  if (!existingRow) return null;

  const existing = mapDealRow(existingRow);
  const merged = { ...existing, ...updates, id };

  await db.run(
    `UPDATE deals SET
      title = ?, subtitle = ?, badge = ?, price = ?, originalPrice = ?,
      image = ?, slug = ?, active = ?, display_order = ?
    WHERE id = ?`,
    [
      merged.title,
      merged.subtitle,
      merged.badge,
      merged.price,
      merged.originalPrice,
      merged.image,
      merged.slug,
      merged.active ? 1 : 0,
      merged.order || 0,
      id,
    ]
  );

  const row = await db.get("SELECT * FROM deals WHERE id = ?", [id]);
  return row ? mapDealRow(row) : null;
}

export async function deleteDeal(id: string): Promise<boolean> {
  await initDb();
  const db = await getDb();
  const res = await db.run("DELETE FROM deals WHERE id = ?", [id]);
  return (res.changes || 0) > 0;
}

// ================= SETTINGS METHODS =================
export async function getSettings(): Promise<SiteSettings> {
  await initDb();
  const db = await getDb();
  const defaults: SiteSettings = {
    siteName: "Industrial Edge",
    tagline: "Total Corporate & Industrial Procurement Solutions",
    phone: "+92 332 2316225",
    whatsapp: "923322316225",
    email: "info@industrialedge.pk",
    address: "Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan",
    googleMapsUrl: "https://maps.app.goo.gl/52dT7YxfarFZ4nPQ7",
    announcementText: "Corporate Discounts available on bulk annual contracts across Pakistan!",
    announcementActive: true,
    gstPercentage: 18,
    footerAbout: "From office essentials to industrial supplies, we're your trusted procurement partner across Pakistan. Simplifying supply chains with reliability, competitive pricing, and timely deliveries.",
    workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
    copyrightText: "© 2026 Industrial Edge. All rights reserved.",
    socialLinkedin: "https://linkedin.com/company/industrial-edge-pk",
    socialFacebook: "https://facebook.com/industrialedge.pk",
    socialWhatsapp: "https://wa.me/923322316225",
    socialInstagram: "https://instagram.com/industrialedge.pk",
    headerLocation: "Karachi Head Office | Nationwide Delivery",
    topBannerTag: "Direct Industrial Sourcing & Corporate Bulk Pricing",
    metaTitle: "Industrial Edge | Pakistan's Premier B2B MRO & Industrial Procurement",
    metaDescription: "Source certified industrial tools, safety PPE, automation components, and genuine bearings with verified NTN invoicing across Pakistan.",
    metaKeywords: "industrial equipment, MRO Pakistan, safety gear Karachi, tools wholesale, Siemens, Bosch, SKF",
    ogImage: "/banner.png",
    robotsIndex: true,
    canonicalUrl: "https://industrialedge.pk",
    requireZipCode: false,
    requireNtnNumber: true,
    requirePoNumber: false,
    allowGuestCheckout: true,
    taxInclusive: false,
  };

  const row = await db.get("SELECT value FROM app_config WHERE key = 'settings'");
  if (!row) {
    await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('settings', ?)", [JSON.stringify(defaults)]);
    return defaults;
  }

  try {
    const parsed = JSON.parse(row.value);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  await initDb();
  const db = await getDb();
  const current = await getSettings();
  const updated: SiteSettings = {
    ...current,
    ...updates,
  };
  await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('settings', ?)", [JSON.stringify(updated)]);
  return updated;
}

// ================= ADMIN AUTH METHODS =================
export async function verifyAdminCredentials(email: string, plainPass: string): Promise<Omit<AdminAccount, "passwordHash"> | null> {
  await initDb();
  const db = await getDb();
  const admin = await db.get("SELECT * FROM admin_users WHERE lower(email) = lower(?)", [email]);
  if (!admin) return null;

  const valid = await bcrypt.compare(plainPass, admin.passwordHash);
  if (!valid) return null;

  const lastLogin = new Date().toISOString();
  await db.run("UPDATE admin_users SET lastLogin = ? WHERE id = ?", [lastLogin, admin.id]);

  return {
    id: String(admin.id),
    email: String(admin.email),
    name: String(admin.name),
    role: String(admin.role),
    lastLogin,
  };
}

export async function changeAdminPassword(email: string, newPassword: string): Promise<boolean> {
  await initDb();
  const db = await getDb();
  const admin = await db.get("SELECT * FROM admin_users WHERE lower(email) = lower(?)", [email]);
  if (!admin) return false;

  const hash = await bcrypt.hash(newPassword, 10);
  await db.run("UPDATE admin_users SET passwordHash = ? WHERE id = ?", [hash, admin.id]);
  return true;
}

// ================= RFQ METHODS =================
export async function getRfqs(): Promise<Rfq[]> {
  await initDb();
  const db = await getDb();
  const rows = await db.all("SELECT * FROM rfqs ORDER BY rowid DESC");
  return rows.map(mapRfqRow);
}

export async function getRfqById(id: string): Promise<Rfq | null> {
  await initDb();
  const db = await getDb();
  const row = await db.get("SELECT * FROM rfqs WHERE id = ? OR rfqNumber = ?", [id, id]);
  return row ? mapRfqRow(row) : null;
}

export async function createRfq(data: Omit<Rfq, "id" | "rfqNumber" | "createdAt" | "updatedAt">): Promise<Rfq> {
  await initDb();
  const db = await getDb();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const rfqNumber = `RFQ-${randomSuffix}`;
  const now = new Date().toISOString();
  const id = `rfq-${Date.now()}`;

  await db.run(
    `INSERT INTO rfqs (
      id, rfqNumber, companyName, contactPerson, email, phone, ntnNumber,
      deliveryLocation, requiredByDate, status, notes, items, subtotalOffered,
      gstAmount, totalOffered, assignedSales, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      rfqNumber,
      data.companyName,
      data.contactPerson,
      data.email,
      data.phone,
      data.ntnNumber || "",
      data.deliveryLocation,
      data.requiredByDate || "",
      data.status || "Submitted",
      data.notes || "",
      JSON.stringify(data.items || []),
      data.subtotalOffered != null ? Number(data.subtotalOffered) : null,
      data.gstAmount != null ? Number(data.gstAmount) : null,
      data.totalOffered != null ? Number(data.totalOffered) : null,
      data.assignedSales || "",
      now,
      now,
    ]
  );

  return (await getRfqById(id))!;
}

export async function updateRfqQuote(id: string, updates: Partial<Rfq>): Promise<Rfq | null> {
  await initDb();
  const db = await getDb();
  const existing = await getRfqById(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates };
  const now = new Date().toISOString();

  await db.run(
    `UPDATE rfqs SET
      companyName = ?, contactPerson = ?, email = ?, phone = ?, ntnNumber = ?,
      deliveryLocation = ?, requiredByDate = ?, status = ?, notes = ?, items = ?,
      subtotalOffered = ?, gstAmount = ?, totalOffered = ?, assignedSales = ?, updatedAt = ?
    WHERE id = ? OR rfqNumber = ?`,
    [
      merged.companyName,
      merged.contactPerson,
      merged.email,
      merged.phone,
      merged.ntnNumber || "",
      merged.deliveryLocation,
      merged.requiredByDate || "",
      merged.status,
      merged.notes || "",
      JSON.stringify(merged.items || []),
      merged.subtotalOffered != null ? Number(merged.subtotalOffered) : null,
      merged.gstAmount != null ? Number(merged.gstAmount) : null,
      merged.totalOffered != null ? Number(merged.totalOffered) : null,
      merged.assignedSales || "",
      now,
      id,
      id,
    ]
  );

  return getRfqById(id);
}

export async function deleteRfq(id: string): Promise<boolean> {
  await initDb();
  const db = await getDb();
  const res = await db.run("DELETE FROM rfqs WHERE id = ? OR rfqNumber = ?", [id, id]);
  return (res.changes || 0) > 0;
}

// ================= CUSTOMER METHODS =================
export async function getCustomers(): Promise<CustomerRecord[]> {
  await initDb();
  const db = await getDb();
  const rows = await db.all("SELECT * FROM customers ORDER BY rowid DESC");
  return rows.map(mapCustomerRow);
}

export async function getCustomerById(id: string): Promise<CustomerRecord | null> {
  await initDb();
  const db = await getDb();
  const row = await db.get("SELECT * FROM customers WHERE id = ? OR email = ?", [id, id]);
  return row ? mapCustomerRow(row) : null;
}

// ================= PRICING & SHIPPING METHODS =================
export async function getPricingShippingData(): Promise<PricingShippingData> {
  await initDb();
  const db = await getDb();
  const fallback: PricingShippingData = {
    currencies: [
      { code: "PKR", name: "Pakistani Rupee", symbol: "Rs.", exchangeRate: 1.0, isDefault: true, isActive: true, formatToken: "{symbol} {amount}" },
      { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 280.0, isDefault: false, isActive: true, formatToken: "{symbol}{amount}" },
      { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 300.0, isDefault: false, isActive: true, formatToken: "{symbol}{amount}" },
      { code: "AED", name: "UAE Dirham", symbol: "AED", exchangeRate: 76.5, isDefault: false, isActive: true, formatToken: "{symbol} {amount}" },
    ],
    shippingRules: [
      { id: "ship-1", regionName: "Karachi Metro / Local Dispatch", baseFlatRate: 350, freeShippingThreshold: 30000, estimatedDeliveryDays: "Same Day / 24 Hours", isActive: true },
      { id: "ship-2", regionName: "Sindh Interior (Hyderabad, Sukkur, Larkana)", baseFlatRate: 650, freeShippingThreshold: 50000, estimatedDeliveryDays: "2-3 Business Days", isActive: true },
      { id: "ship-3", regionName: "Punjab & Islamabad / ICT", baseFlatRate: 850, freeShippingThreshold: 60000, estimatedDeliveryDays: "2-4 Business Days", isActive: true },
      { id: "ship-4", regionName: "KPK, Balochistan, AJK & Gilgit", baseFlatRate: 1200, freeShippingThreshold: 75000, estimatedDeliveryDays: "3-6 Business Days", isActive: true },
    ],
    b2bTiers: [
      { id: "tier-1", minQuantity: 5, maxQuantity: 19, discountPercentage: 5.0, isActive: true },
      { id: "tier-2", minQuantity: 20, maxQuantity: 49, discountPercentage: 10.0, isActive: true },
      { id: "tier-3", minQuantity: 50, discountPercentage: 18.0, isActive: true },
    ],
  };

  const row = await db.get("SELECT value FROM app_config WHERE key = 'pricing_shipping'");
  if (!row) {
    await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('pricing_shipping', ?)", [JSON.stringify(fallback)]);
    return fallback;
  }
  try {
    return JSON.parse(row.value);
  } catch {
    return fallback;
  }
}

export async function savePricingShippingData(data: PricingShippingData): Promise<PricingShippingData> {
  await initDb();
  const db = await getDb();
  await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('pricing_shipping', ?)", [JSON.stringify(data)]);
  return data;
}

// ================= CMS STUDIO METHODS =================
export async function getCmsData(): Promise<CmsStudioData> {
  await initDb();
  const db = await getDb();
  const fallback: CmsStudioData = {
    corporate: {
      title: "For Corporate & Industrial Procurement",
      subtitle: "Streamlined bulk procurement contracts, FBR verified NTN input tax credits, dedicated technical account management, and nationwide site dispatches.",
      ctaText: "Request Corporate Quotation (RFQ)",
      ctaLink: "/contact",
      features: [
        "Commercial Tax Invoices with verified NTN & STRN for corporate audits",
        "Tiered volume discount matrices for enterprise-scale procurements",
        "Nationwide dedicated freight logistics with on-site offloading support",
        "Corporate credit facilities (Net 30/60) for registered enterprises",
      ],
    },
    faqs: [
      { id: "faq-1", category: "B2B Procurement", question: "How do corporate purchase orders and NTN tax credits work?", answer: "We issue computerized commercial tax invoices containing full active STRN and NTN credentials, allowing corporate accounting departments to claim full sales tax input adjustments with the Federal Board of Revenue (FBR).", order: 1, active: true },
      { id: "faq-2", category: "Logistics & Delivery", question: "What are your delivery schedules across Pakistan?", answer: "Karachi Metro shipments are dispatched within 24 hours. Inter-city shipments across Sindh, Punjab, and KPK arrive within 2-4 business days via verified logistics haulers.", order: 2, active: true },
      { id: "faq-3", category: "Warranty & Support", question: "Do industrial tools and heavy equipment carry warranty?", answer: "All power equipment, HVAC systems, and precision instruments include standard 1 to 3 years corporate replacement warranty, backed by on-site technical inspection.", order: 3, active: true },
    ],
    policies: [
      { id: "pol-1", slug: "terms-and-conditions", title: "Corporate Procurement Terms & Conditions", content: "All purchases are subject to Industrial Edge formal quotation parameters, verified corporate PO submission, and agreed payment terms.", published: true, updatedAt: new Date().toISOString() },
      { id: "pol-2", slug: "privacy-policy", title: "Corporate Privacy & Data Protection", content: "Industrial Edge enforces strict encryption standards. Enterprise buyer data, transaction invoices, and RFQ pricing agreements are kept strictly confidential.", published: true, updatedAt: new Date().toISOString() },
    ],
    brands: {
      heading: "Supplying Products From Leading Industrial Brands",
      active: true,
      logos: [
        "/uploads/2025/02/1-1.png",
        "/uploads/2025/02/2-2.png",
        "/uploads/2025/02/3-1.png",
        "/uploads/2025/02/4-1.png",
        "/uploads/2025/02/5-2.png",
        "/uploads/2025/02/6-1.png",
        "/uploads/2025/02/7-1.png",
        "/uploads/2025/02/8-1.png",
        "/uploads/2025/02/9-1.png",
        "/uploads/2025/02/10-1.png",
        "/uploads/2025/02/11-1.png",
        "/uploads/2025/02/12-1.png",
        "/uploads/2025/02/13-1.png",
        "/uploads/2025/02/14.png",
        "/uploads/2025/02/15.png",
        "/uploads/2025/02/16.png",
        "/uploads/2025/02/17.png",
        "/uploads/2025/02/18.png",
        "/uploads/2025/02/19.png",
        "/uploads/2025/02/20.png",
        "/uploads/2025/02/21.png",
        "/uploads/2025/02/22.png",
        "/uploads/2025/02/23.png",
        "/uploads/2025/02/24.png",
      ],
    },
  };

  const row = await db.get("SELECT value FROM app_config WHERE key = 'cms'");
  if (!row) {
    await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('cms', ?)", [JSON.stringify(fallback)]);
    return fallback;
  }
  try {
    return JSON.parse(row.value);
  } catch {
    return fallback;
  }
}

export async function saveCmsData(data: CmsStudioData): Promise<CmsStudioData> {
  await initDb();
  const db = await getDb();
  await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('cms', ?)", [JSON.stringify(data)]);
  return data;
}

// ================= RBAC METHODS =================
export async function getRbacData(): Promise<RbacData> {
  await initDb();
  const db = await getDb();
  const fallback: RbacData = {
    roles: [],
    staff: [],
  };

  const row = await db.get("SELECT value FROM app_config WHERE key = 'rbac'");
  if (!row) {
    await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('rbac', ?)", [JSON.stringify(fallback)]);
    return fallback;
  }
  try {
    return JSON.parse(row.value);
  } catch {
    return fallback;
  }
}

export async function saveRbacData(data: RbacData): Promise<RbacData> {
  await initDb();
  const db = await getDb();
  await db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('rbac', ?)", [JSON.stringify(data)]);
  return data;
}

// ================= CATEGORY METHODS =================
export async function getCategories(): Promise<CategoryItem[]> {
  await initDb();
  const db = await getDb();
  const rows = await db.all("SELECT * FROM categories ORDER BY name ASC");
  const products = await getProducts();

  return rows.map((catRow) => {
    const count = products.filter((p) => p.category === catRow.id || p.category === catRow.slug).length;
    return mapCategoryRow(catRow, count);
  });
}

export async function getCategoryById(id: string): Promise<CategoryItem | null> {
  await initDb();
  const db = await getDb();
  const row = await db.get("SELECT * FROM categories WHERE id = ? OR slug = ?", [id, id]);
  if (!row) return null;

  const products = await getProducts();
  const count = products.filter((p) => p.category === row.id || p.category === row.slug).length;
  return mapCategoryRow(row, count);
}

export async function createCategory(data: { name: string; slug?: string; icon?: string; description?: string; subcategories?: string[] }): Promise<CategoryItem> {
  await initDb();
  const db = await getDb();
  const cleanName = data.name.trim();
  const slug = data.slug?.trim() || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const id = slug || `cat-${Date.now()}`;

  const exists = await db.get("SELECT id FROM categories WHERE lower(id) = lower(?) OR lower(slug) = lower(?)", [id, slug]);
  if (exists) {
    throw new Error(`A category with ID or slug '${id}' already exists.`);
  }

  await db.run(
    "INSERT INTO categories (id, name, slug, icon, description, subcategories) VALUES (?, ?, ?, ?, ?, ?)",
    [id, cleanName, slug, data.icon || "FolderTree", data.description?.trim() || "", JSON.stringify(data.subcategories || [])]
  );

  return {
    id,
    name: cleanName,
    slug,
    icon: data.icon || "FolderTree",
    description: data.description?.trim() || "",
    subcategories: data.subcategories || [],
    productCount: 0,
  };
}

export async function updateCategory(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem | null> {
  await initDb();
  const db = await getDb();
  const existing = await db.get("SELECT * FROM categories WHERE id = ? OR slug = ?", [id, id]);
  if (!existing) return null;

  const oldId = existing.id;
  const newId = updates.id?.trim() || oldId;
  const newName = updates.name ? updates.name.trim() : existing.name;
  const newSlug = updates.slug ? updates.slug.trim() : existing.slug;
  const newIcon = updates.icon || existing.icon;
  const newDesc = updates.description !== undefined ? updates.description : existing.description;
  const newSubs = updates.subcategories !== undefined ? JSON.stringify(updates.subcategories) : existing.subcategories;

  await db.run(
    `UPDATE categories SET id = ?, name = ?, slug = ?, icon = ?, description = ?, subcategories = ? WHERE id = ?`,
    [newId, newName, newSlug, newIcon, newDesc, newSubs, oldId]
  );

  // If ID changed, cascade update to products
  if (oldId !== newId) {
    await db.run("UPDATE products SET category = ? WHERE category = ?", [newId, oldId]);
  }

  return getCategoryById(newId);
}

export async function deleteCategory(id: string, force = false): Promise<{ success: boolean; error?: string }> {
  await initDb();
  const db = await getDb();
  const categoryToDelete = await db.get("SELECT * FROM categories WHERE id = ? OR slug = ?", [id, id]);
  if (!categoryToDelete) {
    return { success: false, error: "Category not found." };
  }

  const linkedCountRow = await db.get<{ count: number }>(
    "SELECT count(*) as count FROM products WHERE category = ? OR category = ?",
    [categoryToDelete.id, categoryToDelete.slug]
  );
  const linkedCount = linkedCountRow?.count || 0;

  if (linkedCount > 0 && !force) {
    return {
      success: false,
      error: `Cannot delete '${categoryToDelete.name}'. There are ${linkedCount} product(s) assigned to this category. Please reassign them first or enable force delete.`,
    };
  }

  if (linkedCount > 0 && force) {
    const remaining = await db.all("SELECT id FROM categories WHERE id != ?", [categoryToDelete.id]);
    const fallbackId = remaining[0]?.id || "uncategorized";
    await db.run("UPDATE products SET category = ? WHERE category = ? OR category = ?", [fallbackId, categoryToDelete.id, categoryToDelete.slug]);
  }

  await db.run("DELETE FROM categories WHERE id = ?", [categoryToDelete.id]);
  return { success: true };
}
