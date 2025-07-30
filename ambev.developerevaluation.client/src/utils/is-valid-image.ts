export const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    return response.ok && contentType?.startsWith("image/") === true;
  } catch {
    return false;
  }
};
