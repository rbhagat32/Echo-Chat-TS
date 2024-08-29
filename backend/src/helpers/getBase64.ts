import { FileProps } from "../types/file.js";

const getBase64 = (file: FileProps): string => {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

export { getBase64 };
