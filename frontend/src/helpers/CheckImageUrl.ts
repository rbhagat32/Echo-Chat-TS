export const isImageUrl = (url: string) => {
  return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
};
