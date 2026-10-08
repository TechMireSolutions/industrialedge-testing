const fs = require('fs/promises');
const path = require('path');
const env = require('../config/env');
const logger = require('./logger');

let sharp = null;
try {
  sharp = require('sharp');
} catch (e) {
  logger.warn('Sharp native module is not installed or failed to load. Falling back to passthrough image handling.', { error: e.message });
}

/**
 * Ensures target upload directory exists
 */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch {
    // Already exists
  }
}

/**
 * Process uploaded image buffer, convert to WebP, optimize dimensions and quality
 *
 * @param {Buffer} inputBuffer - Raw image buffer
 * @param {string} originalFilename - Original filename
 * @param {Object} options - Custom resize & quality options
 * @returns {Promise<{ filename: string, webpUrl: string, cdnUrl: string, sizeBytes: number, width?: number, height?: number }>}
 */
async function processAndConvertToWebP(inputBuffer, originalFilename, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 80,
    subfolder = 'products'
  } = options;

  const targetDir = path.join(env.UPLOAD_DIR, subfolder);
  await ensureDir(targetDir);

  const baseName = path.parse(originalFilename).name.replace(/[^a-zA-Z0-9-_]/g, '_');
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  const outputFilename = `${baseName}-${uniqueSuffix}.webp`;
  const outputPath = path.join(targetDir, outputFilename);

  let outputBuffer = inputBuffer;
  let metadata = {};

  if (sharp) {
    try {
      const imagePipeline = sharp(inputBuffer)
        .rotate() // auto-orient based on EXIF
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality, effort: 4 });

      outputBuffer = await imagePipeline.toBuffer();
      metadata = await sharp(outputBuffer).metadata();
    } catch (sharpError) {
      logger.error('Sharp optimization failed, using original buffer', { error: sharpError.message });
    }
  }

  await fs.writeFile(outputPath, outputBuffer);

  const relativePath = `/uploads/${subfolder}/${outputFilename}`;
  const cdnUrl = `${env.CDN_BASE_URL}${relativePath}`;

  return {
    filename: outputFilename,
    localPath: outputPath,
    relativePath,
    webpUrl: relativePath,
    cdnUrl,
    sizeBytes: outputBuffer.length,
    width: metadata.width || null,
    height: metadata.height || null
  };
}

module.exports = {
  processAndConvertToWebP
};
