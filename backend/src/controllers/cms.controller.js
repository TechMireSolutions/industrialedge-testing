const cmsService = require('../services/cms.service');

// Banners
async function listBanners(req, res, next) {
  try {
    const { type, activeOnly } = req.query;
    const banners = await cmsService.listBanners(type, activeOnly === 'true');
    res.json({ success: true, banners });
  } catch (error) {
    next(error);
  }
}

async function createBanner(req, res, next) {
  try {
    const banner = await cmsService.createBanner(req.body);
    res.status(201).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
}

async function updateBanner(req, res, next) {
  try {
    const banner = await cmsService.updateBanner(req.params.id, req.body);
    res.json({ success: true, banner });
  } catch (error) {
    next(error);
  }
}

async function deleteBanner(req, res, next) {
  try {
    await cmsService.deleteBanner(req.params.id);
    res.json({ success: true, message: 'Banner removed successfully' });
  } catch (error) {
    next(error);
  }
}

// Corporate B2B Content
async function getCorporateSections(req, res, next) {
  try {
    const sections = await cmsService.getCorporateSections();
    res.json({ success: true, sections });
  } catch (error) {
    next(error);
  }
}

async function upsertCorporateSection(req, res, next) {
  try {
    const { sectionKey } = req.params;
    const section = await cmsService.upsertCorporateSection(sectionKey, req.body);
    res.json({ success: true, section });
  } catch (error) {
    next(error);
  }
}

// FAQs
async function listFaqs(req, res, next) {
  try {
    const { category, activeOnly } = req.query;
    const faqs = await cmsService.listFaqs(category, activeOnly === 'true');
    res.json({ success: true, faqs });
  } catch (error) {
    next(error);
  }
}

async function createFaq(req, res, next) {
  try {
    const faq = await cmsService.createFaq(req.body);
    res.status(201).json({ success: true, faq });
  } catch (error) {
    next(error);
  }
}

async function updateFaq(req, res, next) {
  try {
    const faq = await cmsService.updateFaq(req.params.id, req.body);
    res.json({ success: true, faq });
  } catch (error) {
    next(error);
  }
}

async function deleteFaq(req, res, next) {
  try {
    await cmsService.deleteFaq(req.params.id);
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// Policy Pages
async function listPolicyPages(req, res, next) {
  try {
    const pages = await cmsService.listPolicyPages(req.query.published === 'true');
    res.json({ success: true, pages });
  } catch (error) {
    next(error);
  }
}

async function getPolicyPage(req, res, next) {
  try {
    const page = await cmsService.getPolicyPageBySlug(req.params.slug);
    if (!page) return res.status(404).json({ success: false, message: 'Policy page not found' });
    res.json({ success: true, page });
  } catch (error) {
    next(error);
  }
}

async function upsertPolicyPage(req, res, next) {
  try {
    const page = await cmsService.upsertPolicyPage(req.body);
    res.json({ success: true, page });
  } catch (error) {
    next(error);
  }
}

async function deletePolicyPage(req, res, next) {
  try {
    await cmsService.deletePolicyPage(req.params.id);
    res.json({ success: true, message: 'Policy page deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getCorporateSections,
  upsertCorporateSection,
  listFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  listPolicyPages,
  getPolicyPage,
  upsertPolicyPage,
  deletePolicyPage
};
