export const downloadImage = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to download image from ${url}`);
  }
  return await response.blob();
};
