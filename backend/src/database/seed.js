const bcrypt = require('bcryptjs');
const { pool, withTransaction } = require('../config/db');
const { ROLES, PERMISSIONS } = require('../config/constants');
const { generateUniqueSku } = require('../utils/skuGenerator');
const { DEFAULT_SETTINGS } = require('../services/settings.service');
const logger = require('../utils/logger');

async function seedDatabase() {
  logger.info('Starting PostgreSQL database seeding...');

  try {
    await withTransaction(async (client) => {
      // 1. SEED PERMISSIONS
      logger.info('Seeding RBAC permissions...');
      const permIds = {};
      const allPermissions = Object.values(PERMISSIONS);

      for (const permName of allPermissions) {
        const [resource, action] = permName.split(':');
        const res = await client.query(
          `INSERT INTO permissions (name, resource, action, description)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
           RETURNING id, name`,
          [permName, resource, action, `Allows ${action} operational privileges on ${resource}`]
        );
        permIds[permName] = res.rows[0].id;
      }

      // 2. SEED ROLES
      logger.info('Seeding RBAC roles & role-permission mappings...');
      const roleIds = {};

      const rolesToSeed = [
        { name: ROLES.SUPER_ADMIN, description: 'Master administrator with unrestricted operational authority', isSystem: true, perms: allPermissions },
        {
          name: ROLES.CATALOG_MANAGER,
          description: 'Catalog management, products CRUD, inventory tracking, media updates',
          isSystem: false,
          perms: [
            PERMISSIONS.PRODUCTS_READ, PERMISSIONS.PRODUCTS_CREATE, PERMISSIONS.PRODUCTS_UPDATE,
            PERMISSIONS.PRODUCTS_DELETE, PERMISSIONS.PRODUCTS_BULK, PERMISSIONS.INVENTORY_READ,
            PERMISSIONS.INVENTORY_ADJUST, PERMISSIONS.CMS_MANAGE
          ]
        },
        {
          name: ROLES.LOGISTICS_COORDINATOR,
          description: 'Order fulfillment, shipping matrix rule management, dispatch notifications',
          isSystem: false,
          perms: [PERMISSIONS.ORDERS_READ, PERMISSIONS.ORDERS_UPDATE, PERMISSIONS.SHIPPING_MANAGE, PERMISSIONS.INVENTORY_READ]
        },
        {
          name: ROLES.SALES_REP,
          description: 'B2B RFQ reviews, customer inquiries, and price quote adjustments',
          isSystem: false,
          perms: [PERMISSIONS.RFQ_READ, PERMISSIONS.RFQ_MANAGE, PERMISSIONS.CUSTOMERS_READ, PERMISSIONS.ORDERS_READ, PERMISSIONS.PRICING_MANAGE]
        }
      ];

      for (const r of rolesToSeed) {
        const resRole = await client.query(
          `INSERT INTO roles (name, description, is_system_role)
           VALUES ($1, $2, $3)
           ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
           RETURNING id, name`,
          [r.name, r.description, r.isSystem]
        );
        const roleId = resRole.rows[0].id;
        roleIds[r.name] = roleId;

        // Assign permissions to role
        for (const pName of r.perms) {
          const pId = permIds[pName];
          if (pId) {
            await client.query(
              `INSERT INTO role_permissions (role_id, permission_id)
               VALUES ($1, $2)
               ON CONFLICT DO NOTHING`,
              [roleId, pId]
            );
          }
        }
      }

      // 3. SEED DEFAULT SUPER ADMIN USER
      logger.info('Seeding Master Admin account...');
      const defaultPasswordHash = await bcrypt.hash('admin123', 10);
      await client.query(
        `INSERT INTO admin_users (email, password_hash, name, role_id, is_active)
         VALUES ($1, $2, $3, $4, TRUE)
         ON CONFLICT (email) DO UPDATE SET role_id = EXCLUDED.role_id`,
        ['admin@industrialedge.pk', defaultPasswordHash, 'Head Administrator', roleIds[ROLES.SUPER_ADMIN]]
      );

      // 4. SEED CATEGORIES & SUBCATEGORIES
      logger.info('Seeding catalog categories...');
      const categoriesData = [
        { id: 'electronic-appliances', name: 'Electronics & IT Gear', icon: 'Cpu', display_order: 1 },
        { id: 'hardware-tools', name: 'Hardware & Tools', icon: 'Wrench', display_order: 2 },
        { id: 'office-supplies', name: 'Office & Stationery', icon: 'Briefcase', display_order: 3 },
        { id: 'safety-equipment', name: 'Safety Gear (PPE)', icon: 'HardHat', display_order: 4 },
        { id: 'industrial-chemicals', name: 'Chemicals & Lubricants', icon: 'FlaskConical', display_order: 5 },
        { id: 'electrical-components', name: 'Electrical & Cabling', icon: 'Zap', display_order: 6 }
      ];

      for (const cat of categoriesData) {
        await client.query(
          `INSERT INTO categories (id, name, slug, icon, display_order)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon`,
          [cat.id, cat.name, cat.id, cat.icon, cat.display_order]
        );
      }

      // 5. SEED CURRENCIES
      logger.info('Seeding multi-currency controls...');
      const currenciesData = [
        { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs.', exchange_rate: 1.0, is_default: true, format_token: '{symbol} {amount}' },
        { code: 'USD', name: 'US Dollar', symbol: '$', exchange_rate: 280.0, is_default: false, format_token: '{symbol}{amount}' },
        { code: 'EUR', name: 'Euro', symbol: '€', exchange_rate: 300.0, is_default: false, format_token: '{symbol}{amount}' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'AED', exchange_rate: 76.5, is_default: false, format_token: '{symbol} {amount}' }
      ];

      for (const curr of currenciesData) {
        await client.query(
          `INSERT INTO currencies (code, name, symbol, exchange_rate, is_default, is_active, format_token)
           VALUES ($1, $2, $3, $4, $5, TRUE, $6)
           ON CONFLICT (code) DO UPDATE SET exchange_rate = EXCLUDED.exchange_rate, is_default = EXCLUDED.is_default`,
          [curr.code, curr.name, curr.symbol, curr.exchange_rate, curr.is_default, curr.format_token]
        );
      }

      // 6. SEED REGIONAL SHIPPING RULES
      logger.info('Seeding shipping rules matrix...');
      const shippingData = [
        { region: 'Karachi Metro / Local Dispatch', baseRate: 350.00, freeThreshold: 30000.00, delivery: 'Same Day / Next Day' },
        { region: 'Sindh Interior (Hyderabad, Sukkur, Larkana)', baseRate: 650.00, freeThreshold: 50000.00, delivery: '2-3 Business Days' },
        { region: 'Punjab & Islamabad / ICT', baseRate: 850.00, freeThreshold: 60000.00, delivery: '2-4 Business Days' },
        { region: 'KPK, Balochistan, AJK & Northern Areas', baseRate: 1200.00, freeThreshold: 75000.00, delivery: '3-6 Business Days' }
      ];

      for (const s of shippingData) {
        await client.query(
          `INSERT INTO shipping_rules (region_name, base_flat_rate, free_shipping_threshold, estimated_delivery_days)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [s.region, s.baseRate, s.freeThreshold, s.delivery]
        );
      }

      // 7. SEED INITIAL PRODUCTS
      logger.info('Seeding sample production products...');
      const initialProducts = [
        {
          id: 'prod-1',
          sku: 'IE-HAR-TOO-2001',
          name: 'Heavy-Duty Brushless Cordless Impact Drill Kit 20V',
          slug: 'cordless-impact-drill-kit-20v',
          category_id: 'hardware-tools',
          price: 24500.00,
          original_price: 28000.00,
          stock_quantity: 45,
          low_stock_threshold: 10,
          min_order_qty: 1,
          unit: 'Kit',
          is_featured: true,
          is_new: true,
          image: '/uploads/2025/03/200.png',
          description: 'Industrial grade 20V brushless impact drill with twin 4.0Ah Li-ion batteries, fast smart charger, and 32-piece heavy duty bit set.',
          specifications: { Voltage: '20V Max', MaxTorque: '85 Nm', BatteryCapacity: '4.0 Ah (Twin)', ChuckSize: '13mm All-Metal Keyless' }
        },
        {
          id: 'prod-2',
          sku: 'IE-ELE-APP-4002',
          name: 'Commercial High-Efficiency Ceiling Air Conditioner 4-Ton',
          slug: 'commercial-ceiling-air-conditioner-4-ton',
          category_id: 'electronic-appliances',
          price: 385000.00,
          original_price: 420000.00,
          stock_quantity: 12,
          low_stock_threshold: 3,
          min_order_qty: 1,
          unit: 'Unit',
          is_featured: true,
          image: '/uploads/2025/03/198.png',
          description: 'Full inverter commercial grade 4-ton cassette AC designed for corporate offices and data server facilities.',
          specifications: { Capacity: '48,000 BTU (4 Ton)', Technology: 'DC Inverter Eco Cool', Warranty: '3 Years Corporate Comprehensive' }
        },
        {
          id: 'prod-3',
          sku: 'IE-OFF-SUP-3003',
          name: 'Executive Ergonomic High-Back Breathable Mesh Chair',
          slug: 'executive-ergonomic-mesh-chair',
          category_id: 'office-supplies',
          price: 32000.00,
          original_price: 36500.00,
          stock_quantity: 50,
          low_stock_threshold: 8,
          min_order_qty: 2,
          unit: 'Piece',
          is_featured: true,
          image: '/uploads/2025/03/197.png',
          description: 'Dynamic lumbar support ergonomic chair featuring heavy-duty 4D adjustable armrests and certified class-4 gas lift.',
          specifications: { WeightCapacity: '150 kg', BaseMaterial: 'Reinforced Aluminum Alloy', Warranty: '2 Years Replacement' }
        },
        {
          id: 'prod-4',
          sku: 'IE-SAF-EQU-1004',
          name: 'Certified Industrial Safety Helmet with Ratchet Suspension (Class E)',
          slug: 'industrial-safety-helmet-class-e',
          category_id: 'safety-equipment',
          price: 1850.00,
          original_price: 2200.00,
          stock_quantity: 250,
          low_stock_threshold: 25,
          min_order_qty: 10,
          unit: 'Piece',
          is_featured: false,
          image: '/uploads/2025/03/196.png',
          description: 'ANSI/ISEA Z89.1 certified Type 1 Class E dielectric hard hat engineered for high-voltage industrial utility facilities.',
          specifications: { Material: 'High-Density Polyethylene (HDPE)', Suspension: '6-Point Ratchet', Standard: 'ANSI Z89.1 Class E' }
        }
      ];

      for (const p of initialProducts) {
        await client.query(
          `INSERT INTO products (
            id, sku, name, slug, category_id, price, original_price,
            stock_quantity, low_stock_threshold, min_order_qty, unit, in_stock,
            is_featured, is_new, is_active, description, specifications, meta_title
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, TRUE,
            $12, $13, TRUE, $14, $15, $16
          )
          ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock_quantity = EXCLUDED.stock_quantity`,
          [
            p.id, p.sku, p.name, p.slug, p.category_id, p.price, p.original_price,
            p.stock_quantity, p.low_stock_threshold, p.min_order_qty, p.unit,
            p.is_featured || false, p.is_new || false, p.description,
            JSON.stringify(p.specifications), p.name
          ]
        );

        // Product primary image
        await client.query(
          `INSERT INTO product_images (product_id, image_url, webp_url, alt_text, is_primary, display_order)
           VALUES ($1, $2, $2, $3, TRUE, 0)
           ON CONFLICT DO NOTHING`,
          [p.id, p.image, p.name]
        );

        // Seed inventory log
        await client.query(
          `INSERT INTO inventory_logs (product_id, change_type, quantity_changed, previous_quantity, new_quantity, reference_id, notes, performed_by)
           VALUES ($1, 'initial', $2, 0, $2, 'SEED_SETUP', 'Initial seed allocation', 'system')
           ON CONFLICT DO NOTHING`,
          [p.id, p.stock_quantity]
        );

        // Seed B2B volume pricing tiers for each product
        await client.query(
          `INSERT INTO b2b_price_tiers (product_id, min_quantity, max_quantity, discount_percentage)
           VALUES ($1, 5, 19, 5.00), ($1, 20, 49, 10.00), ($1, 50, NULL, 18.00)
           ON CONFLICT DO NOTHING`,
          [p.id]
        );
      }

      // 8. SEED CMS BANNERS & SECTIONS
      logger.info('Seeding CMS banners and corporate portal content...');
      await client.query(
        `INSERT INTO cms_banners (title, subtitle, badge, price, original_price, image_url, link_url, banner_type, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'hero_slider', 1, TRUE)
         ON CONFLICT DO NOTHING`,
        [
          'Heavy-Duty Cordless Impact Drill Kit 20V',
          'Industrial grade brushless motor with twin 4.0Ah Li-ion batteries and fast charger.',
          'Special Wholesale Offer',
          24500,
          28000,
          '/uploads/2025/03/200.png',
          '/products/cordless-impact-drill-kit-20v'
        ]
      );

      // Seed Corporate B2B Section
      await client.query(
        `INSERT INTO cms_corporate_sections (section_key, title, subtitle, content, is_active)
         VALUES ($1, $2, $3, $4, TRUE)
         ON CONFLICT (section_key) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content`,
        [
          'hero',
          'Corporate & Industrial B2B Procurement',
          'Streamlined bulk procurement, corporate tax credit compliance, volume discount matrices, and dedicated account managers.',
          JSON.stringify({
            ctaButtonText: 'Submit Corporate RFQ',
            ctaButtonLink: '/rfq',
            features: [
              'Commercial Tax Invoice & Active NTN Verification',
              'Credit Terms for Verified Corporate Clients (Net 30/60)',
              'Nationwide Fleet Logistics & Safe On-Site Delivery',
              'Dedicated Technical Account Manager'
            ]
          })
        ]
      );

      // Seed FAQs
      await client.query(
        `INSERT INTO cms_faqs (category, question, answer, display_order)
         VALUES
         ('B2B Procurement', 'How do corporate purchase orders and NTN tax credits work?', 'We issue certified Sales Tax Commercial Invoices with registered STRN & NTN numbers, enabling corporate clients to claim full input tax credits with FBR.', 1),
         ('Delivery & Logistics', 'What are your delivery timelines across Pakistan?', 'Orders in Karachi Metro are fulfilled within 24 hours. Nationwide dispatches to Punjab, Sindh Interior, and KPK arrive within 2-4 business days.', 2)
         ON CONFLICT DO NOTHING`
      );

      // Seed Policies
      await client.query(
        `INSERT INTO cms_policy_pages (slug, title, content, is_published)
         VALUES
         ('terms-and-conditions', 'Corporate Procurement Terms & Conditions', 'All purchases are subject to Industrial Edge formal quotation parameters and standard corporate warranty guidelines.', TRUE),
         ('privacy-policy', 'Privacy and Data Protection Policy', 'Industrial Edge Pakistan enforces strict encryption and enterprise privacy controls on all corporate buyer data.', TRUE)
         ON CONFLICT (slug) DO NOTHING`
      );

      // 9. SEED GLOBAL SETTINGS
      logger.info('Seeding global system settings...');
      for (const [key, val] of Object.entries(DEFAULT_SETTINGS)) {
        await client.query(
          `INSERT INTO global_settings (key, value, description)
           VALUES ($1, $2, $3)
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
          [key, JSON.stringify(val), `Default configuration parameters for ${key}`]
        );
      }

      logger.info('Database seeding completed successfully with all initial data!');
    });
  } catch (error) {
    logger.error('Database seeding failed', { error: error.message, stack: error.stack });
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
