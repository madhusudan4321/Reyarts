const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const artworkStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'reyarts/artworks', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'reyarts/blogs', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const exhibitionStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'reyarts/exhibitions', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const timelineStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'reyarts/timeline', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const uploadArtwork = multer({ storage: artworkStorage });
const uploadBlog = multer({ storage: blogStorage });
const uploadExhibition = multer({ storage: exhibitionStorage });
const uploadTimeline = multer({ storage: timelineStorage });

module.exports = { cloudinary, uploadArtwork, uploadBlog, uploadExhibition, uploadTimeline };
