"use client";

import { useRef, useState, type DragEvent } from "react";
import { ImageIcon, Loader2, RefreshCw, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api-path";

type SingleImageFieldProps = {
  token: string;
  image?: string | null;
  folder?: string;
  label?: string;
  hint?: string;
  onChange: (url: string | null) => void;
};

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

async function uploadImage(
  token: string,
  file: File,
  folder: string,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch(apiUrl("/api/admin/upload"), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const payload = (await response.json()) as { url?: string; error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Upload failed");
  }
  if (!payload.url) {
    throw new Error("Upload succeeded but no URL was returned.");
  }

  return payload.url;
}

function pickImageFile(files: FileList | File[] | null | undefined) {
  if (!files?.length) return null;
  return Array.from(files).find((file) => file.type.startsWith("image/")) ?? null;
}

export function SingleImageField({
  token,
  image,
  folder = "team",
  label = "Photo",
  hint = "Drag & drop or click to upload a portrait photo",
  onChange,
}: SingleImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(files: FileList | File[] | null | undefined) {
    const file = pickImageFile(files);
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      onChange(await uploadImage(token, file, folder));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Check S3 credentials and try again.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!uploading) setDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    if (uploading) return;
    void handleUpload(event.dataTransfer.files);
  }

  return (
    <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-brand-600" />
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>

      {image ? (
        <div className="space-y-3">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative mx-auto aspect-[4/5] max-w-[200px] overflow-hidden rounded-xl border border-black/10",
              dragging && "ring-2 ring-brand-400/40",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Team member"
              className="h-full w-full object-cover"
              onError={() =>
                setError("Image URL is not accessible. Upload again to replace it.")
              }
            />
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            ) : null}
          </div>
          <div className="flex gap-2">
            <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs font-medium hover:border-brand-400/40 hover:bg-brand-500/5">
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Replace
              <input
                ref={inputRef}
                type="file"
                accept={IMAGE_ACCEPT}
                className="hidden"
                disabled={uploading}
                onChange={(e) => void handleUpload(e.target.files)}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-lg border border-black/10 px-3 py-2 text-xs font-medium hover:border-red-400/40 hover:bg-red-500/10"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "rounded-lg border border-dashed border-black/15 transition-colors hover:border-brand-400/40 hover:bg-brand-500/5",
            dragging && "border-brand-400/60 bg-brand-500/10",
          )}
        >
          <label className="flex cursor-pointer flex-col items-center justify-center px-4 py-10 text-center">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-7 w-7 text-muted-foreground" />
                <span className="mt-2 text-sm font-medium">Upload photo</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG, WebP — portrait recommended
                </span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="hidden"
              disabled={uploading}
              onChange={(e) => void handleUpload(e.target.files)}
            />
          </label>
        </div>
      )}

      {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
