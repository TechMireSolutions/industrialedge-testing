const pricingService = require('../services/pricing.service');

async function listCurrencies(req, res, next) {
  try {
    const currencies = await pricingService.listCurrencies();
    const defaultCurr = await pricingService.getDefaultCurrency();
    res.json({ success: true, default: defaultCurr, currencies });
  } catch (error) {
    next(error);
  }
}

async function upsertCurrency(req, res, next) {
  try {
    const currency = await pricingService.upsertCurrency(req.body);
    res.json({ success: true, currency });
  } catch (error) {
    next(error);
  }
}

async function convertPrice(req, res, next) {
  try {
    const { amount, currency } = req.query;
    if (!amount) return res.status(400).json({ success: false, message: 'Amount is required' });
    const converted = await pricingService.convertAmount(parseFloat(amount), currency);
    res.json({ success: true, ...converted });
  } catch (error) {
    next(error);
  }
}

async function listB2BTiers(req, res, next) {
  try {
    const tiers = await pricingService.listB2BTiers(req.query.productId);
    res.json({ success: true, tiers });
  } catch (error) {
    next(error);
  }
}

async function createB2BTier(req, res, next) {
  try {
    const tier = await pricingService.createB2BTier(req.body);
    res.status(201).json({ success: true, tier });
  } catch (error) {
    next(error);
  }
}

async function deleteB2BTier(req, res, next) {
  try {
    await pricingService.deleteB2BTier(req.params.id);
    res.json({ success: true, message: 'Tier deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function calculatePrice(req, res, next) {
  try {
    const { productId, quantity } = req.query;
    if (!productId || !quantity) {
      return res.status(400).json({ success: false, message: 'productId and quantity are required' });
    }
    const calculation = await pricingService.calculatePriceForQuantity(productId, parseInt(quantity, 10));
    res.json({ success: true, calculation });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCurrencies,
  upsertCurrency,
  convertPrice,
  listB2BTiers,
  createB2BTier,
  deleteB2BTier,
  calculatePrice
};
