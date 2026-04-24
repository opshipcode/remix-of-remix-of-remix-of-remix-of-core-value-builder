// ─── Cloudinary Upload Helper ────────────────────────────────────────────────
// Fill in your cloud name and upload preset below.
// The upload preset must be set to "unsigned" in your Cloudinary dashboard.

const CLOUDINARY_CLOUD_NAME = "dj61pyo1e"; // ← replace
const CLOUDINARY_UPLOAD_PRESET = "jagajaga"; // ← replace

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

/**
 * Upload a File object to Cloudinary (unsigned upload).
 * Returns the secure URL and metadata.
 *
 * Usage:
 *   const { url } = await uploadToCloudinary(file);
 *   setData({ profileImage: url });
 */
export async function uploadToCloudinary(
  file: File,
  folder = "kitpager"
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Cloudinary upload failed");
  }

  const data = await res.json();
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    width: data.width as number,
    height: data.height as number,
    format: data.format as string,
    bytes: data.bytes as number,
  };
}

/**
 * Derive a Cloudinary transformation URL from an existing secure_url.
 * Useful for resizing avatars, thumbnails, etc.
 *
 * Example:
 *   transformCloudinary(url, "w_200,h_200,c_fill,q_auto,f_auto")
 */
export function transformCloudinary(url: string, transformation: string): string {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/${transformation}/`);
}

/**
 * Convert a File to a local object URL for instant preview before upload.
 * Remember to call URL.revokeObjectURL(previewUrl) when done.
 */
export function createLocalPreview(file: File): string {
  return URL.createObjectURL(file);
}