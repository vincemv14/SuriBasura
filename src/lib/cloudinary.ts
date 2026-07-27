/**
 * Lightweight Cloudinary upload using the unsigned upload API.
 * No heavy SDK import — just a fetch call to their REST endpoint.
 */

export async function uploadImage(
  base64DataUrl: string,
  folder: string = "suri-basura"
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    // If Cloudinary not configured, return empty — image just won't be stored
    console.warn("Cloudinary not configured — skipping image upload");
    return "";
  }

  // Generate signature for signed upload
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

  // Use Web Crypto API to generate SHA-1 signature
  const encoder = new TextEncoder();
  const data = encoder.encode(paramsToSign + apiSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const formData = new FormData();
  formData.append("file", base64DataUrl);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Cloudinary upload failed:", err);
    return "";
  }

  const result = await res.json();
  return result.secure_url;
}
