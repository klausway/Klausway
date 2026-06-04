import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { uploadToS3 } from "@/lib/s3";

export async function POST(request: Request) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = String(formData.get("folder") ?? "uploads");
    const key = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const url = await uploadToS3({
      key,
      body: buffer,
      contentType: file.type || "application/octet-stream",
    });

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error("[admin upload]", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
