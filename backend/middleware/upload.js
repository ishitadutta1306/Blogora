import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

//configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//configure multer-storage-cloudinary
const storage=new CloudinaryStorage({ cloudinary,
  // params: async (req, file) => {
  //   return {
  //     folder: "blogora",
  //     resource_type: "image",
  //     // public_id: `${Date.now()}-${file.originalname}`,
  //     // allowed_formats: ["jpg", "jpeg", "png", "webp"],
  //   };
  // },
  params: {
    folder: "blogora",
    resource_type: "image",
  },
});

const upload=multer({ storage });
console.log("✅ Cloudinary upload middleware initialized");

export default upload;
