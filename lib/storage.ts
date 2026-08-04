import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { uploadToS3 } from "@/lib/s3";
import { assetPath } from "@/lib/asset-path";

type UploadFileInput = {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
};

function useLocalUploads() {
  const driver = (process.env.UPLOAD_DRIVER ?? "").toLowerCase();
  if (driver === "local") return true;
  if (driver === "s3") return false;
  // Auto: local when S3 is not configured (typical for laptop/dev).
  return !process.env.S3_BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID;
}

async function uploadLocally({ key, body }: UploadFileInput) {
  const safeKey = key.replace(/^\/+/, "").replace(/\.\./g, "");
  const filePath = path.join(process.cwd(), "public", "uploads", safeKey);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, body);

  // Served by Next from /public — respect basePath on GitHub Pages builds.
  return assetPath(`/uploads/${safeKey}`);
}

/** Upload CMS media to local disk (dev) or S3 (production). */
export async function uploadMedia(input: UploadFileInput) {
  if (useLocalUploads()) {
    return {
      url: await uploadLocally(input),
      driver: "local" as const,
    };
  }

  return {
    url: await uploadToS3(input),
    driver: "s3" as const,
  };
}
