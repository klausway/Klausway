import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { defaultQrCodes } from "@/lib/qr";

export const dynamic = "force-dynamic";

function redirectTo(destination: string, request: Request) {
  // 302 + no-store: scanners must never cache the target, or edits in the CMS stop applying.
  const response = NextResponse.redirect(new URL(destination, request.url), 302);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const fallback = defaultQrCodes.find((code) => code.slug === slug);

  try {
    const code = await db.qrCode.findUnique({ where: { slug } });
    if (code) {
      if (!code.active) return redirectTo("/", request);
      await db.qrCode.update({
        where: { id: code.id },
        data: { scanCount: { increment: 1 }, lastScannedAt: new Date() },
      });
      return redirectTo(code.destination, request);
    }
  } catch (error) {
    console.error("[qr redirect]", error);
  }

  return redirectTo(fallback?.destination ?? "/", request);
}
