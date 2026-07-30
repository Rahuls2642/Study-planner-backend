import {
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import path from "path";
import { randomUUID } from "crypto";

import { env } from "@/config/env";
import { storageClient } from "@/config/storage";

class StorageService {
  generateKey(
    folder: string,
    originalName: string
  ) {
    const extension = path.extname(originalName);

    return `${folder}/${randomUUID()}${extension}`;
  }

  async upload(
    file: Express.Multer.File,
    folder: string
  ) {
    const storageKey = this.generateKey(
      folder,
      file.originalname
    );

    await storageClient.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET,
        Key: storageKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return {
      storageKey,
      bucket: env.AWS_BUCKET,
      originalName: file.originalname,
      mimeType: file.mimetype,
    };
  }

  async delete(storageKey: string) {
    await storageClient.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_BUCKET,
        Key: storageKey,
      })
    );
  }
}

export const storageService = new StorageService();
