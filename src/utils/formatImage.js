const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const formatImage = (image) => {    
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${IMAGE_BASE_URL}${image}`;
}