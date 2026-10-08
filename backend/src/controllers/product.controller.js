const productService = require('../services/product.service');
const { generateUniqueSku } = require('../utils/skuGenerator');
const { generateUniqueSlug } = require('../utils/slugify');

async function listProducts(req, res, next) {
  try {
    const result = await productService.listProducts(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const adminUser = req.user ? req.user.email : 'admin';
    const product = await productService.createProduct(req.body, adminUser);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const adminUser = req.user ? req.user.email : 'admin';
    const product = await productService.updateProduct(req.params.id, req.body, adminUser);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function duplicateProduct(req, res, next) {
  try {
    const adminUser = req.user ? req.user.email : 'admin';
    const product = await productService.duplicateProduct(req.params.id, adminUser);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function generateSkuTrigger(req, res, next) {
  try {
    const { category, subcategory } = req.query;
    const sku = await generateUniqueSku(category, subcategory);
    res.json({ success: true, sku });
  } catch (error) {
    next(error);
  }
}

async function generateSlugTrigger(req, res, next) {
  try {
    const { text, currentId } = req.query;
    if (!text) return res.status(400).json({ success: false, message: 'Text is required for slug generation' });
    const slug = await generateUniqueSlug(text, 'products', currentId);
    res.json({ success: true, slug });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  duplicateProduct,
  deleteProduct,
  generateSkuTrigger,
  generateSlugTrigger
};
