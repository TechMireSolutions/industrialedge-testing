const { processAndConvertToWebP } = require('../utils/webpConverter');
const { query } = require('../config/db');

async function uploadMedia(req, res, next) {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided for upload' });
    }

    const { productId, subfolder = 'products', isPrimary } = req.body;
    const processedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await processAndConvertToWebP(file.buffer, file.originalname, {
        subfolder,
        quality: 82
      });

      // If productId is provided, insert into product_images table
      if (productId) {
        const primaryFlag = isPrimary === 'true' || isPrimary === true || i === 0;
        const imgRes = await query(
          `INSERT INTO product_images (product_id, image_url, webp_url, alt_text, is_primary, display_order)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [productId, result.relativePath, result.cdnUrl, file.originalname, primaryFlag, i]
        );
        result.dbRecord = imgRes.rows[0];
      }

      processedImages.push(result);
    }

    res.status(201).json({
      success: true,
      count: processedImages.length,
      images: processedImages
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProductImage(req, res, next) {
  try {
    const { imageId } = req.params;
    const resDel = await query('DELETE FROM product_images WHERE id = $1 RETURNING *', [imageId]);
    if (resDel.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Image record not found' });
    }
    res.json({ success: true, message: 'Image deleted from gallery', deleted: resDel.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadMedia,
  deleteProductImage
};
