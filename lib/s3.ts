import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

type UploadFileInput = {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
};

export async function uploadToS3({ key, body, contentType }: UploadFileInput) {
  const bucket = process.env.S3_BUCKET_NAME;
  const prefix = process.env.S3_DOCUMENTS_PREFIX ?? "";

  if (!bucket) {
    throw new Error("S3 bucket is not configured");
  }

  const objectKey = `${prefix}${key}`.replace(/\/{2,}/g, "/");

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ContentType: contentType,
      ACL: "public-read",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  const region = process.env.AWS_REGION ?? "us-east-1";
  return `https://${bucket}.s3.${region}.amazonaws.com/${objectKey}`;
}
