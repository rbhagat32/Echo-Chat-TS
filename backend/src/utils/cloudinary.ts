import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import { FileProps } from "../types/file.js";
import sharp from "sharp";
import streamifier from "streamifier";

interface ReturnTypes {
  public_id: string | null;
  url: string | null;
}

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
}

const uploadToCloudinary = async (file: FileProps): Promise<ReturnTypes> => {
  if (!file || !file.buffer) {
    return {
      public_id: null,
      url: null,
    };
  }

  try {
    // sharp accepts Buffer as input and returns a Buffer (compressed) as output
    const compressedBuffer = await sharp(file.buffer)
      .resize({ width: 200 })
      .png({ quality: 70 })
      .toBuffer();

    const uploadFromBuffer = (buffer: Buffer): Promise<CloudinaryUploadResult> => {
      // uploadFromBuffer function returns uploadPromise
      return new Promise((resolve, reject) => {
        const uploadImage = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            public_id: uuid(),
          },
          (error, result) => {
            if (error) return reject(error);

            if (result) resolve(result as CloudinaryUploadResult);
            else reject(new Error("Upload result is undefined"));
          }
        );

        // streamifier is used to convert the buffer into a stream
        // and pipe it to the upload stream
        streamifier.createReadStream(buffer).pipe(uploadImage);
      });
    };

    // uploadFromBuffer function returns uploadPromise that resolves to the result of the upload
    const result = await uploadFromBuffer(compressedBuffer);

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.log("Image Upload error: ", error);
    return {
      public_id: null,
      url: null,
    };
  }
};

const deleteFromCloudinary = async (public_id: string): Promise<boolean> => {
  if (!public_id) {
    return false;
  }

  const deletePromise = new Promise<boolean>((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, { resource_type: "image" }, (error, result) => {
      if (error) return reject(error);

      if (result.result === "ok") return resolve(true);
      else return resolve(false);
    });
  });

  try {
    const success = await deletePromise;
    return success;
  } catch (error) {
    console.log("Error deleting from Cloudinary:", error);
    return false;
  }
};

export { uploadToCloudinary, deleteFromCloudinary };
