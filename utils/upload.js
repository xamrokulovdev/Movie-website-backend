const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const allowedFormats = ["png", "jpg", "jpeg", "webp", "avif", "mp4"];

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileFormat = file.mimetype.split("/")[1];
    if (!allowedFormats.includes(fileFormat)) {
      throw new Error("File format not allowed");
    }
    const isVideo = fileFormat === "mp4";
    return {
      folder: isVideo ? "videos" : "images",
      resource_type: isVideo ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = upload;