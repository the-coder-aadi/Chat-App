import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "./cloudinary.js"

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "my-files",
    resource_type: "auto"
  }
})

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "video/mp4",
      "application/pdf"
    ]

    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Only image, video and pdf allowed"))
    }
  }
})

export default upload