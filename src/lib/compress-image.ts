/**
 * Compress a base64 image data URL to a smaller size suitable for API calls.
 * Resizes to max 512px on longest side and compresses to JPEG quality 0.7.
 */
export function compressImage(dataUrl: string, maxSize = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");

      let { width, height } = img;

      // Scale down to maxSize on longest side
      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG with quality 0.7 (~50-100KB output)
      const compressed = canvas.toDataURL("image/jpeg", 0.7);
      resolve(compressed);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}
