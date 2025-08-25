export const truncateFileName = (fileName: string, maxLength: number = 40): string => {
  const dotIndex = fileName.lastIndexOf(".");

  const namePart = fileName.substring(0, dotIndex);
  const extension = fileName.substring(dotIndex); // includes the dot (e.g., ".png")

  if (namePart.length + extension.length <= maxLength) {
    return fileName;
  }

  const truncatedName = namePart.substring(0, maxLength - extension.length);
  return `${truncatedName}...${extension}`;
};
