"use client";

import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { ImageIcon, Images, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageFieldsProps = {
  token: string;
  coverImage?: string | null;
  galleryImages?: string[];
  folder: "blog" | "portfolio";
  onCoverChange: (url: string | null) => void;
  onGalleryChange: (urls: string[]) => void;
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

  const response = await fetch("/api/admin/upload", {
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

function pickImageFiles(files: FileList | File[] | null | undefined) {
  if (!files?.length) return [];
  return Array.from(files).filter((file) => file.type.startsWith("image/"));
}

function DropZone({
  disabled,
  onFiles,
  className,
  children,
}: {
  disabled?: boolean;
  onFiles: (files: File[]) => void;
  className?: string;
  children: ReactNode;
}) {
  const [dragging, setDragging] = useState(false);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) setDragging(true);
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
    if (disabled) return;
    onFiles(pickImageFiles(event.dataTransfer.files));
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        className,
        dragging && !disabled && "border-brand-400/60 bg-brand-500/10 ring-2 ring-brand-400/30",
      )}
    >
      {children}
    </div>
  );
}

export function ImageFields({
  token,
  coverImage,
  galleryImages = [],
  folder,
  onCoverChange,
  onGalleryChange,
}: ImageFieldsProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCoverUpload(files: File[]) {
    const file = files[0];
    if (!file) return;
    setUploadingCover(true);
    setError(null);
    try {
      onCoverChange(await uploadImage(token, file, `${folder}/covers`));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Cover upload failed. Check S3 credentials and try again.",
      );
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  async function handleGalleryUpload(files: File[]) {
    if (!files.length) return;
    setUploadingGallery(true);
    setError(null);
    try {
      const urls = await Promise.all(
        files.map((file) => uploadImage(token, file, `${folder}/gallery`)),
      );
      onGalleryChange([...galleryImages, ...urls]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gallery upload failed. Check S3 credentials and try again.",
      );
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-3 flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-brand-300" />
          <div>
            <p className="text-sm font-medium">Cover image</p>
            <p className="text-xs text-muted-foreground">
              Drag & drop or click to upload — shown on cards and detail hero
            </p>
          </div>
        </div>
        {coverImage ? (
          <div className="space-y-3">
            <DropZone
              disabled={uploadingCover}
              onFiles={(files) => void handleCoverUpload(files)}
              className="relative overflow-hidden rounded-lg border border-white/10 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt="Cover"
                className="aspect-video w-full object-cover"
                onError={() =>
                  setError(
                    "Cover image URL is not accessible. Upload again to replace it.",
                  )
                }
              />
              {uploadingCover ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              ) : null}
            </DropZone>
            <div className="flex gap-2">
              <DropZone
                disabled={uploadingCover}
                onFiles={(files) => void handleCoverUpload(files)}
                className="inline-flex flex-1"
              >
                <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium hover:border-brand-400/40 hover:bg-brand-500/5">
                  {uploadingCover ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  Replace
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept={IMAGE_ACCEPT}
                    className="hidden"
                    disabled={uploadingCover}
                    onChange={(e) =>
                      void handleCoverUpload(pickImageFiles(e.target.files))
                    }
                  />
                </label>
              </DropZone>
              <button
                type="button"
                onClick={() => onCoverChange(null)}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium hover:border-red-400/40 hover:bg-red-500/10"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <DropZone
            disabled={uploadingCover}
            onFiles={(files) => void handleCoverUpload(files)}
            className="rounded-lg border border-dashed border-white/15 transition-colors hover:border-brand-400/40 hover:bg-brand-500/5"
          >
            <label className="flex cursor-pointer flex-col items-center justify-center px-4 py-10 text-center">
              {uploadingCover ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-7 w-7 text-muted-foreground" />
                  <span className="mt-2 text-sm font-medium">Upload cover</span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    Drag & drop or click — JPG, PNG, WebP
                  </span>
                </>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept={IMAGE_ACCEPT}
                className="hidden"
                disabled={uploadingCover}
                onChange={(e) =>
                  void handleCoverUpload(pickImageFiles(e.target.files))
                }
              />
            </label>
          </DropZone>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Images className="h-4 w-4 text-brand-300" />
          <div>
            <p className="text-sm font-medium">Gallery</p>
            <p className="text-xs text-muted-foreground">
              Drag & drop multiple images — detail page gallery only
            </p>
          </div>
        </div>
        {galleryImages.length > 0 ? (
          <div className="mb-3 grid grid-cols-3 gap-2">
            {galleryImages.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="relative overflow-hidden rounded-lg border border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="aspect-square w-full object-cover"
                  onError={() =>
                    setError(
                      "A gallery image is not accessible. Remove it and upload again.",
                    )
                  }
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() =>
                    onGalleryChange(galleryImages.filter((_, i) => i !== index))
                  }
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-red-400 transition-colors hover:bg-black/80 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-3 text-xs text-muted-foreground">No gallery images yet</p>
        )}
        <DropZone
          disabled={uploadingGallery}
          onFiles={(files) => void handleGalleryUpload(files)}
          className="rounded-lg border border-dashed border-white/15 transition-colors hover:border-brand-400/40 hover:bg-brand-500/5"
        >
          <label className="flex cursor-pointer items-center justify-center gap-2 px-4 py-3 text-sm text-muted-foreground">
            {uploadingGallery ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Add gallery images
              </>
            )}
            <input
              ref={galleryInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              multiple
              className="hidden"
              disabled={uploadingGallery}
              onChange={(e) =>
                void handleGalleryUpload(pickImageFiles(e.target.files))
              }
            />
          </label>
        </DropZone>
      </div>

      {error ? <p className="md:col-span-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
