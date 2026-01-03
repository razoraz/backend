import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // Tentukan folder berdasarkan endpoint
    let folder = 'others';

    if (req.originalUrl.includes('/menu')) {
      folder = 'menu';
    } else if (req.originalUrl.includes('/feedback')) {
      folder = 'feedback';
    } else if (req.originalUrl.includes('/event')) {
      folder = 'event';
    }

    return {
      folder,
      resource_type: 'auto', // ⭐ PENTING
      allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'webm', 'mov'],
      public_id: `${folder}-${Date.now()}`,
    };
  },
});

const upload = multer({ storage });

export default upload;
