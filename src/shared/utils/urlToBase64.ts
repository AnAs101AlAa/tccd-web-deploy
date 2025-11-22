export const parseURI = (file: Blob): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const getDataBlob = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const blob = await response.blob();
    const uri = await parseURI(blob);
    return uri;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
