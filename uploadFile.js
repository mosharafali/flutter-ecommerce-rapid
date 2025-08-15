const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Create multer storage for Cloudinary
const createCloudinaryStorage = (folder) =>
    new CloudinaryStorage({
        cloudinary,
        params: {
            folder: folder, // e.g., "categories", "products", "posters"
            allowed_formats: ['jpg', 'jpeg', 'png'],
            transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
        },
    });

// Multer uploaders
const uploadCategory = multer({ storage: createCloudinaryStorage('categories'), limits: { fileSize: 5 * 1024 * 1024 } });
const uploadProduct = multer({ storage: createCloudinaryStorage('products'), limits: { fileSize: 5 * 1024 * 1024 } });
const uploadPoster = multer({ storage: createCloudinaryStorage('posters'), limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = {
    cloudinary,
    uploadCategory,
    uploadProduct,
    uploadPoster,
};
