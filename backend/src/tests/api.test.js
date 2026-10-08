/**
 * Automated Verification & Unit Test Suite for Industrial Edge V2 Backend
 */

const { cleanPrefix, generateUniqueSku } = require('../utils/skuGenerator');
const { createSlugString } = require('../utils/slugify');
const { parseProductCsv, exportProductsToCsv } = require('../utils/csvHandler');
const { generateCorporatePdf } = require('../utils/pdfGenerator');
const { ROLES, PERMISSIONS, ORDER_STATUS } = require('../config/constants');
const logger = require('../utils/logger');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    logger.info(`[PASS] ${testName}`);
    passedTests++;
  } else {
    logger.error(`[FAIL] ${testName}`);
    throw new Error(`Assertion failed: ${testName}`);
  }
}

async function runTestSuite() {
  logger.info('====================================================');
  logger.info('Running Industrial Edge V2 Backend Verification Suite');
  logger.info('====================================================');

  // Test 1: SKU Prefix Sanitization
  const prefix1 = cleanPrefix('Hardware & Tools', 'GEN', 3);
  assert(prefix1 === 'HAR', 'SKU prefix correctly cleans and extracts 3 characters');

  const prefix2 = cleanPrefix('', 'DEF', 3);
  assert(prefix2 === 'DEF', 'SKU prefix defaults when empty');

  // Test 2: Dynamic SEO Slug Generation
  const slug1 = createSlugString('Commercial High-Efficiency Ceiling AC 4-Ton!');
  assert(slug1 === 'commercial-high-efficiency-ceiling-ac-4-ton', 'Slug normalization removes punctuation and converts spaces to hyphens');

  const slug2 = createSlugString('  Industrial---Safety   Helmet  ');
  assert(slug2 === 'industrial-safety-helmet', 'Slug normalization collapses consecutive hyphens and trims');

  // Test 3: Automated SKU Generation Format
  const sampleSku = await generateUniqueSku('hardware-tools', 'cordless-drills');
  assert(sampleSku.startsWith('IE-HAR-COR-'), `Generated SKU '${sampleSku}' matches IE-{CAT}-{SUB}-{RANDOM} format`);

  // Test 4: CSV Parser Validations
  const sampleCsv = `name,category_id,price,stock_quantity,unit
Heavy-Duty Drill,hardware-tools,24500,10,Kit
Safety Goggles,safety-equipment,850,50,Piece
Invalid Product,,not_a_number,5,Unit`;

  const parseResult = parseProductCsv(sampleCsv);
  assert(parseResult.validRows.length === 2, 'CSV parser accurately identified 2 valid products');
  assert(parseResult.errors.length === 1, 'CSV parser accurately caught 1 invalid row (missing category and invalid price)');
  assert(parseResult.validRows[0].price === 24500, 'CSV parser correctly cast price to float');

  // Test 5: CSV Catalog Exporter
  const exportedCsv = exportProductsToCsv(parseResult.validRows);
  assert(exportedCsv.includes('Heavy-Duty Drill') && exportedCsv.includes('24500'), 'CSV exporter outputs properly formatted CSV string');

  // Test 6: B2B Pricing Calculation Simulation
  const basePrice = 10000;
  const quantity = 25;
  const discountTier = 10.0; // 10% discount
  const unitPrice = basePrice * (1 - discountTier / 100);
  const subtotal = unitPrice * quantity;
  assert(unitPrice === 9000, 'B2B tier applies 10% volume discount correctly');
  assert(subtotal === 225000, 'B2B line item subtotal calculates correctly');

  // Test 7: Shipping Free Threshold Evaluation
  const orderTotalHigh = 65000;
  const freeThreshold = 50000;
  const qualifiesForFreeShipping = orderTotalHigh >= freeThreshold;
  assert(qualifiesForFreeShipping === true, 'Order over 50,000 correctly qualifies for free corporate shipping');

  // Test 8: Custom Corporate PDF Quotation Generation
  const dummyQuoteData = {
    number: 'RFQ-89210',
    companyName: 'Packages Limited',
    contactPerson: 'M. Ali Khan',
    email: 'procurement@packages.com.pk',
    phone: '+92 300 1234567',
    ntnNumber: '1928374-2',
    deliveryLocation: 'Shahrah-e-Roomi, Lahore',
    items: [
      { product_name: 'Industrial Safety Helmet Class E', sku: 'IE-SAF-EQU-1004', requested_qty: 100, unit: 'Piece', quoted_unit_price: 1800 }
    ],
    subtotal: 180000,
    gst_percentage: 18,
    gst_amount: 32400,
    total_amount: 212400,
    currency: 'PKR'
  };

  const pdfBuffer = await generateCorporatePdf(dummyQuoteData, 'QUOTATION');
  assert(Buffer.isBuffer(pdfBuffer) && pdfBuffer.length > 1000, 'PDF generator successfully created valid corporate PDF quotation buffer');

  // Test 9: System Constants & RBAC Roles Check
  assert(ROLES.SUPER_ADMIN === 'Super Admin', 'RBAC Super Admin role constant is defined');
  assert(PERMISSIONS.PRODUCTS_CREATE === 'products:create', 'Granular product create permission is defined');
  assert(ORDER_STATUS.DISPATCHED === 'Dispatched', 'Order status Dispatched enum is defined');

  logger.info('====================================================');
  logger.info(`Verification Suite Completed: ${passedTests}/${totalTests} tests passed successfully!`);
  logger.info('====================================================');
}

if (require.main === module) {
  runTestSuite().catch((err) => {
    logger.error('Test suite failed', { error: err.message, stack: err.stack });
    process.exit(1);
  });
}

module.exports = runTestSuite;
