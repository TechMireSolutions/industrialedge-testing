module.exports = {
  ROLES: {
    SUPER_ADMIN: 'Super Admin',
    CATALOG_MANAGER: 'Catalog Manager',
    LOGISTICS_COORDINATOR: 'Logistics Coordinator',
    SALES_REP: 'Sales Representative'
  },

  PERMISSIONS: {
    // Products
    PRODUCTS_READ: 'products:read',
    PRODUCTS_CREATE: 'products:create',
    PRODUCTS_UPDATE: 'products:update',
    PRODUCTS_DELETE: 'products:delete',
    PRODUCTS_BULK: 'products:bulk',

    // Inventory
    INVENTORY_READ: 'inventory:read',
    INVENTORY_ADJUST: 'inventory:adjust',

    // Orders
    ORDERS_READ: 'orders:read',
    ORDERS_UPDATE: 'orders:update',
    ORDERS_DELETE: 'orders:delete',

    // RFQ / Quotes
    RFQ_READ: 'rfq:read',
    RFQ_MANAGE: 'rfq:manage',

    // Customers
    CUSTOMERS_READ: 'customers:read',
    CUSTOMERS_MANAGE: 'customers:manage',

    // Pricing & Shipping
    PRICING_MANAGE: 'pricing:manage',
    SHIPPING_MANAGE: 'shipping:manage',

    // CMS & Content
    CMS_MANAGE: 'cms:manage',

    // Global Settings & RBAC
    SETTINGS_MANAGE: 'settings:manage',
    USERS_MANAGE: 'users:manage'
  },

  ORDER_STATUS: {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    DISPATCHED: 'Dispatched',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
  },

  RFQ_STATUS: {
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
    QUOTED: 'Quoted',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CONVERTED_TO_ORDER: 'Converted_To_Order'
  },

  INQUIRY_STATUS: {
    NEW: 'New',
    READ: 'Read',
    IN_REVIEW: 'In Review',
    RESOLVED: 'Resolved'
  },

  DEFAULT_GST_RATE: 18.00,
  DEFAULT_CURRENCY: 'PKR',
  DEFAULT_LOW_STOCK_THRESHOLD: 5
};
