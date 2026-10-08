-- ====================================================================
-- INDUSTRIAL EDGE V2 - POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Compliant with ACID, Strict Referential Integrity & Audit Logging
-- ====================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ====================================================================
-- 1. ROLE-BASED ACCESS CONTROL (RBAC) & ADMIN USERS
-- ====================================================================

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ====================================================================
-- 2. PRODUCT & INVENTORY CATALOG ENGINE
-- ====================================================================

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'LayoutGrid',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subcategories (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(100) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id VARCHAR(100) REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_id VARCHAR(100) REFERENCES subcategories(id) ON DELETE SET NULL,
    price NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(14, 2) CHECK (original_price IS NULL OR original_price >= 0),
    cost_price NUMERIC(14, 2) DEFAULT 0 CHECK (cost_price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    min_order_qty INTEGER NOT NULL DEFAULT 1 CHECK (min_order_qty >= 1),
    unit VARCHAR(50) NOT NULL DEFAULT 'Piece',
    in_stock BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    flat_shipping_fee NUMERIC(10, 2) DEFAULT 0.00 CHECK (flat_shipping_fee >= 0),
    rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    description TEXT NOT NULL,
    specifications JSONB DEFAULT '{}'::jsonb,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    webp_url TEXT,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_tags (
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL, -- 'restock', 'sale', 'adjustment', 'return', 'initial'
    quantity_changed INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reference_id VARCHAR(100), -- orderId, PO number, or audit id
    notes TEXT,
    performed_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_subcategories_updated_at BEFORE UPDATE ON subcategories FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- Indexes for high-throughput catalog searches and lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(is_active, in_stock);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_product_images_prod_primary ON product_images(product_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_inventory_product_date ON inventory_logs(product_id, created_at DESC);

-- ====================================================================
-- 3. DYNAMIC PRICING & SHIPPING MATRIX
-- ====================================================================

CREATE TABLE IF NOT EXISTS currencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL, -- 'PKR', 'USD', 'EUR', 'AED'
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,       -- 'Rs.', '$', '€', 'AED'
    exchange_rate NUMERIC(14, 6) NOT NULL DEFAULT 1.000000, -- relative to base PKR
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    format_token VARCHAR(50) DEFAULT '{symbol} {amount}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipping_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_name VARCHAR(100) NOT NULL, -- e.g., 'Karachi Metro', 'Sindh Interior', 'Punjab & ICT', 'KPK & Balochistan'
    base_flat_rate NUMERIC(10, 2) NOT NULL DEFAULT 350.00,
    free_shipping_threshold NUMERIC(12, 2) DEFAULT 50000.00,
    estimated_delivery_days VARCHAR(50) DEFAULT '2-4 Business Days',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS b2b_price_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
    category_id VARCHAR(100) REFERENCES categories(id) ON DELETE CASCADE,
    min_quantity INTEGER NOT NULL CHECK (min_quantity >= 1),
    max_quantity INTEGER CHECK (max_quantity IS NULL OR max_quantity >= min_quantity),
    discount_percentage NUMERIC(5, 2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    custom_unit_price NUMERIC(14, 2) CHECK (custom_unit_price IS NULL OR custom_unit_price >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_currencies_updated_at BEFORE UPDATE ON currencies FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_shipping_rules_updated_at BEFORE UPDATE ON shipping_rules FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_b2b_price_tiers_updated_at BEFORE UPDATE ON b2b_price_tiers FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ====================================================================
-- 4. SITE CONTENT & CMS CONTROL
-- ====================================================================

CREATE TABLE IF NOT EXISTS cms_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    badge VARCHAR(100),
    price NUMERIC(14, 2),
    original_price NUMERIC(14, 2),
    image_url TEXT NOT NULL,
    link_url TEXT,
    slug VARCHAR(255),
    banner_type VARCHAR(50) DEFAULT 'hero_slider', -- 'hero_slider', 'announcement_bar', 'promo_strip'
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cms_corporate_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(100) UNIQUE NOT NULL, -- 'hero', 'procurement_value', 'audit_compliance', 'cta_block'
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cms_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) DEFAULT 'General',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cms_policy_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL, -- 'terms-and-conditions', 'privacy-policy', 'b2b-procurement-terms'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_cms_banners_updated_at BEFORE UPDATE ON cms_banners FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_cms_faqs_updated_at BEFORE UPDATE ON cms_faqs FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_cms_policy_pages_updated_at BEFORE UPDATE ON cms_policy_pages FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ====================================================================
-- 5. CUSTOMERS, ORDERS & LIVE TRACKING PIPELINE
-- ====================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    company_name VARCHAR(200),
    phone VARCHAR(50),
    ntn_number VARCHAR(50),
    billing_address TEXT,
    shipping_address TEXT,
    city VARCHAR(100),
    total_orders INTEGER DEFAULT 0,
    total_spend NUMERIC(14, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    company_name VARCHAR(200),
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    ntn_number VARCHAR(50),
    delivery_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    shipping_region_id UUID REFERENCES shipping_rules(id) ON DELETE SET NULL,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'Corporate Invoice / PO',
    po_number VARCHAR(100),
    notes TEXT,
    subtotal NUMERIC(14, 2) NOT NULL,
    gst_percentage NUMERIC(5, 2) DEFAULT 18.00,
    gst_amount NUMERIC(14, 2) NOT NULL,
    total_amount NUMERIC(14, 2) NOT NULL,
    currency_code VARCHAR(10) DEFAULT 'PKR',
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'
    tracking_carrier VARCHAR(100),
    tracking_code VARCHAR(100),
    dispatched_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    unit VARCHAR(50) DEFAULT 'Piece',
    price NUMERIC(14, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    subtotal NUMERIC(14, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by_admin VARCHAR(100),
    notified_customer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ====================================================================
-- 6. RFQ / CORPORATE INQUIRY MANAGEMENT HUB
-- ====================================================================

CREATE TABLE IF NOT EXISTS rfqs (
    id VARCHAR(100) PRIMARY KEY,
    rfq_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    company_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    ntn_number VARCHAR(50),
    delivery_location TEXT NOT NULL,
    required_by_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Submitted', -- 'Submitted', 'Under Review', 'Quoted', 'Approved', 'Rejected', 'Converted_To_Order'
    notes TEXT,
    terms_conditions TEXT,
    subtotal_offered NUMERIC(14, 2) DEFAULT 0.00,
    gst_percentage NUMERIC(5, 2) DEFAULT 18.00,
    gst_amount NUMERIC(14, 2) DEFAULT 0.00,
    total_offered NUMERIC(14, 2) DEFAULT 0.00,
    pdf_quote_url TEXT,
    assigned_sales_rep VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rfq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id VARCHAR(100) NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    requested_qty INTEGER NOT NULL CHECK (requested_qty >= 1),
    unit VARCHAR(50) DEFAULT 'Unit',
    target_budget NUMERIC(14, 2),
    quoted_unit_price NUMERIC(14, 2),
    quoted_subtotal NUMERIC(14, 2),
    negotiation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS general_inquiries (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(200),
    service VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'New', -- 'New', 'Read', 'In Review', 'Resolved'
    reply_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_rfqs_updated_at BEFORE UPDATE ON rfqs FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_general_inquiries_updated_at BEFORE UPDATE ON general_inquiries FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE INDEX IF NOT EXISTS idx_rfqs_number ON rfqs(rfq_number);
CREATE INDEX IF NOT EXISTS idx_rfqs_email ON rfqs(email);
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);

-- ====================================================================
-- 7. GLOBAL SYSTEM & CONFIGURATION SETTINGS
-- ====================================================================

CREATE TABLE IF NOT EXISTS global_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_global_settings_updated_at BEFORE UPDATE ON global_settings FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
