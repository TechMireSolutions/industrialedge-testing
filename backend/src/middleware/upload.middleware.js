const multer = require('multer');
const env = require('../config/env');

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('InvalidFileType: Only JPEG, PNG, WEBP, and SVG images are supported.'), false);
  }
};

const csvFilter = (req, file, cb) => {
  const allowed = [
    'text/csv',
    'text/plain',
    'application/vnd.ms-excel',
    'application/csv',
    'text/x-csv',
    'application/x-csv',
    'text/comma-separated-values'
  ];
  if (allowed.includes(file.mimetype) || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('InvalidFileType: Only CSV files (.csv) are accepted for bulk import.'), false);
  }
};

const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024
  }
});

const uploadCsv = multer({
  storage,
  fileFilter: csvFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB for large CSV catalog
  }
});

module.exports = {
  uploadImages,
  uploadCsv
};
