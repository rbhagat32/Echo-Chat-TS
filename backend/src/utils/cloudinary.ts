import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import { getBase64 } from "../helpers/getBase64.js";
import { FileProps } from "../types/file.js";

interface CloudinaryResponse {
  public_id: string | null;
  url: string | null;
}

interface CloudinaryUploadResult {
  public_id: string;
  url: string;
}

const uploadToCloudinary = async (
  file: FileProps
): Promise<CloudinaryResponse> => {
  if (!file) {
    return {
      public_id: null,
      url: null,
    };
  }

  const uploadPromise = new Promise<CloudinaryUploadResult>(
    (resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        { resource_type: "auto", public_id: uuid() },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result as CloudinaryUploadResult);
        }
      );
    }
  );

  try {
    const result = await uploadPromise;

    const formattedResult = {
      public_id: result.public_id,
      url: result.url,
    };

    return formattedResult;
  } catch (error) {
    console.log(error);
    return {
      public_id: null,
      url: null,
    };
  }
};

const deleteFromCloudinary = async (public_id: string) => {};

export { uploadToCloudinary, deleteFromCloudinary };
