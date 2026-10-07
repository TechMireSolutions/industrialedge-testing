import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { Product, PRODUCTS as initialProducts } from "@/data/products";

const DB_DIR = path.join(process.cwd(), "data", "db");
const PRODUCTS_FILE = path.join(DB_DIR, "products.json");
const ORDERS_FILE = path.join(DB_DIR, "orders.json");
const INQUIRIES_FILE = path.join(DB_DIR, "inquiries.json");
const DEALS_FILE = path.join(DB_DIR, "deals.json");
const ADMIN_FILE = path.join(DB_DIR, "admin.json");
const SETTINGS_FILE = path.join(DB_DIR, "settings.json");

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
}

// Helper: Ensure directory exists
async function ensureDbDir() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch {
    // Already exists
  }
}

// Atomic file write to avoid corruption
async function writeJsonFile(filePath: string, data: unknown) {
  await ensureDbDir();
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tempPath, filePath);
}

// Safe read JSON file
async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    await writeJsonFile(filePath, fallback);
    return fallback;
  }
}

// Database Initializer
export async function initDb() {
  await ensureDbDir();

  // 1. Products
  try {
    await fs.access(PRODUCTS_FILE);
  } catch {
    await writeJsonFile(PRODUCTS_FILE, initialProducts);
  }

  // 2. Admin User
  try {
    await fs.access(ADMIN_FILE);
  } catch {
    const defaultPasswordHash = await bcrypt.hash("admin123", 10);
    const defaultAdmin: AdminAccount[] = [
      {
        id: "admin-1",
        email: "admin@industrialedge.pk",
        passwordHash: defaultPasswordHash,
        name: "Head Administrator",
        role: "Super Admin",
      },
    ];
    await writeJsonFile(ADMIN_FILE, defaultAdmin);
  }

  // 3. Orders
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await writeJsonFile(ORDERS_FILE, []);
  }

  // 4. Inquiries
  try {
    await fs.access(INQUIRIES_FILE);
  } catch {
    await writeJsonFile(INQUIRIES_FILE, []);
  }

  // 5. Deals
  try {
    await fs.access(DEALS_FILE);
  } catch {
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
    await writeJsonFile(DEALS_FILE, initialDeals);
  }

  // 6. Settings
  try {
    await fs.access(SETTINGS_FILE);
  } catch {
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
    };
    await writeJsonFile(SETTINGS_FILE, defaultSettings);
  }
}

// ================= PRODUCT METHODS =================
export async function getProducts(): Promise<Product[]> {
  await initDb();
  return readJsonFile<Product[]>(PRODUCTS_FILE, initialProducts);
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const products = await getProducts();
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  };
  products.unshift(newProduct);
  await writeJsonFile(PRODUCTS_FILE, products);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    id, // preserve ID
  };
  await writeJsonFile(PRODUCTS_FILE, products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  await writeJsonFile(PRODUCTS_FILE, filtered);
  return true;
}

// ================= ORDER METHODS =================
export async function getOrders(): Promise<Order[]> {
  await initDb();
  return readJsonFile<Order[]>(ORDERS_FILE, []);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id) || null;
}

export async function createOrder(data: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Promise<Order> {
  const orders = await getOrders();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `IE-${randomSuffix}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...data,
    id: `ord-${Date.now()}`,
    orderNumber,
    status: data.status || "Pending",
    createdAt: now,
    updatedAt: now,
  };

  orders.unshift(newOrder);
  await writeJsonFile(ORDERS_FILE, orders);
  return newOrder;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  await writeJsonFile(ORDERS_FILE, orders);
  return orders[index];
}

export async function deleteOrder(id: string): Promise<boolean> {
  const orders = await getOrders();
  const filtered = orders.filter((o) => o.id !== id && o.orderNumber !== id);
  if (filtered.length === orders.length) return false;
  await writeJsonFile(ORDERS_FILE, filtered);
  return true;
}

// ================= INQUIRY METHODS =================
export async function getInquiries(): Promise<Inquiry[]> {
  await initDb();
  return readJsonFile<Inquiry[]>(INQUIRIES_FILE, []);
}

export async function createInquiry(data: Omit<Inquiry, "id" | "status" | "createdAt">): Promise<Inquiry> {
  const inquiries = await getInquiries();
  const newInquiry: Inquiry = {
    ...data,
    id: `inq-${Date.now()}`,
    status: "New",
    createdAt: new Date().toISOString(),
  };
  inquiries.unshift(newInquiry);
  await writeJsonFile(INQUIRIES_FILE, inquiries);
  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"], replyNotes?: string): Promise<Inquiry | null> {
  const inquiries = await getInquiries();
  const index = inquiries.findIndex((i) => i.id === id);
  if (index === -1) return null;

  inquiries[index].status = status;
  if (replyNotes !== undefined) {
    inquiries[index].replyNotes = replyNotes;
  }
  await writeJsonFile(INQUIRIES_FILE, inquiries);
  return inquiries[index];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const inquiries = await getInquiries();
  const filtered = inquiries.filter((i) => i.id !== id);
  if (filtered.length === inquiries.length) return false;
  await writeJsonFile(INQUIRIES_FILE, filtered);
  return true;
}

// ================= DEALS METHODS =================
export async function getDeals(): Promise<HeroDeal[]> {
  await initDb();
  const deals = await readJsonFile<HeroDeal[]>(DEALS_FILE, []);
  return deals.sort((a, b) => a.order - b.order);
}

export async function createDeal(data: Omit<HeroDeal, "id" | "createdAt">): Promise<HeroDeal> {
  const deals = await getDeals();
  const newDeal: HeroDeal = {
    ...data,
    id: `deal-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  deals.push(newDeal);
  await writeJsonFile(DEALS_FILE, deals);
  return newDeal;
}

export async function updateDeal(id: string, updates: Partial<HeroDeal>): Promise<HeroDeal | null> {
  const deals = await getDeals();
  const index = deals.findIndex((d) => d.id === id);
  if (index === -1) return null;

  deals[index] = {
    ...deals[index],
    ...updates,
    id,
  };
  await writeJsonFile(DEALS_FILE, deals);
  return deals[index];
}

export async function deleteDeal(id: string): Promise<boolean> {
  const deals = await getDeals();
  const filtered = deals.filter((d) => d.id !== id);
  if (filtered.length === deals.length) return false;
  await writeJsonFile(DEALS_FILE, filtered);
  return true;
}

// ================= SETTINGS METHODS =================
export async function getSettings(): Promise<SiteSettings> {
  await initDb();
  return readJsonFile<SiteSettings>(SETTINGS_FILE, {
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
  });
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated: SiteSettings = {
    ...current,
    ...updates,
  };
  await writeJsonFile(SETTINGS_FILE, updated);
  return updated;
}

// ================= ADMIN AUTH METHODS =================
export async function verifyAdminCredentials(email: string, plainPass: string): Promise<Omit<AdminAccount, "passwordHash"> | null> {
  await initDb();
  const admins = await readJsonFile<AdminAccount[]>(ADMIN_FILE, []);
  const admin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!admin) return null;

  const valid = await bcrypt.compare(plainPass, admin.passwordHash);
  if (!valid) return null;

  // Update last login
  admin.lastLogin = new Date().toISOString();
  await writeJsonFile(ADMIN_FILE, admins);

  const { passwordHash: _, ...safeAdmin } = admin;
  return safeAdmin;
}

export async function changeAdminPassword(email: string, newPassword: string): Promise<boolean> {
  await initDb();
  const admins = await readJsonFile<AdminAccount[]>(ADMIN_FILE, []);
  const admin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!admin) return false;

  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  await writeJsonFile(ADMIN_FILE, admins);
  return true;
}
