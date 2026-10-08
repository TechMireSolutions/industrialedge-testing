const customerService = require('../services/customer.service');

async function listCustomers(req, res, next) {
  try {
    const result = await customerService.listCustomers(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function getCustomerDetails(req, res, next) {
  try {
    const customer = await customerService.getCustomerDetails(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer account not found' });
    }
    res.json({ success: true, customer });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCustomers,
  getCustomerDetails
};
