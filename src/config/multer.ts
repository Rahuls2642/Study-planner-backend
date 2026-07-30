import multer from "multer";
import { ApiError } from "@/config/utils/ApiError";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(
        new ApiError(
          400,
          "Only PDF, PNG and JPEG files are allowed."
        )
      );
    }

    cb(null, true);
  },
});
