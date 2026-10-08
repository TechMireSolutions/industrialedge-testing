const settingsService = require('../services/settings.service');

async function getAllSettings(req, res, next) {
  try {
    const settings = await settingsService.getAllSettings();
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
}

async function getSettingGroup(req, res, next) {
  try {
    const { group } = req.params;
    const value = await settingsService.getSettingByKey(group);
    res.json({ success: true, group, value });
  } catch (error) {
    next(error);
  }
}

async function updateSettingGroup(req, res, next) {
  try {
    const { group } = req.params;
    const { value, description } = req.body;
    if (!value) return res.status(400).json({ success: false, message: 'Settings value object is required' });
    const updated = await settingsService.updateSettingByKey(group, value, description);
    res.json({ success: true, group, updated });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllSettings,
  getSettingGroup,
  updateSettingGroup
};
