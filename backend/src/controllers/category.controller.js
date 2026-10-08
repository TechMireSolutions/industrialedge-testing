const categoryService = require('../services/category.service');

async function listCategories(req, res, next) {
  try {
    const includeInactive = req.query.all === 'true';
    const categories = await categoryService.listCategories(includeInactive);
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function createSubcategory(req, res, next) {
  try {
    const subcategory = await categoryService.createSubcategory(req.body);
    res.status(201).json({ success: true, subcategory });
  } catch (error) {
    next(error);
  }
}

async function deleteSubcategory(req, res, next) {
  try {
    await categoryService.deleteSubcategory(req.params.id);
    res.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function listTags(req, res, next) {
  try {
    const tags = await categoryService.listTags();
    res.json({ success: true, tags });
  } catch (error) {
    next(error);
  }
}

async function createTag(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Tag name is required' });
    const tag = await categoryService.createTag(name);
    res.status(201).json({ success: true, tag });
  } catch (error) {
    next(error);
  }
}

async function deleteTag(req, res, next) {
  try {
    await categoryService.deleteTag(req.params.id);
    res.json({ success: true, message: 'Tag deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  deleteSubcategory,
  listTags,
  createTag,
  deleteTag
};
