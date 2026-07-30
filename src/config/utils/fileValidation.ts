import { ApiError } from "./ApiError";

export function validateFileBuffer(file: Express.Multer.File) {
  if (!file.buffer || file.buffer.length === 0) {
    throw new ApiError(400, "File is empty");
  }

  const { mimetype, buffer } = file;

  if (mimetype === "application/pdf") {
    const magic = buffer.subarray(0, 5).toString("ascii");
    if (magic !== "%PDF-") {
      throw new ApiError(400, "Invalid PDF content");
    }

    // Quick check for EOF signature anywhere in the last 1024 bytes
    const endChunk = buffer.subarray(Math.max(0, buffer.length - 1024)).toString("ascii");
    if (!endChunk.includes("%%EOF")) {
      throw new ApiError(400, "Corrupted PDF file (missing %%EOF marker)");
    }
  } else if (mimetype === "image/png") {
    const magic = buffer.subarray(0, 8).toString("hex").toUpperCase();
    if (magic !== "89504E470D0A1A0A") {
      throw new ApiError(400, "Invalid PNG content");
    }
  } else if (mimetype === "image/jpeg" || mimetype === "image/jpg") {
    const magic = buffer.subarray(0, 3).toString("hex").toUpperCase();
    if (magic !== "FFD8FF") {
      throw new ApiError(400, "Invalid JPEG content");
    }
  } else {
    throw new ApiError(400, "Unsupported file type");
  }
}
