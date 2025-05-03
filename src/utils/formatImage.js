const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const DEFAULT_IMAGE = 'https://via.placeholder.com/100?text=No+Image';

export const formatImage = (image) => {    
  if (!image) return DEFAULT_IMAGE;
  if (image.startsWith("http")) return image;
  return `${IMAGE_BASE_URL}${image}`;
}