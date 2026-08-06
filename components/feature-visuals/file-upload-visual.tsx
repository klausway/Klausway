import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  CircleCheck,
  Lock,
} from "lucide-react";

const files = [
  {
    icon: <FileText className="h-4 w-4" />,
    name: "Q3-contract-final.pdf",
    size: "2.4 MB",
    progress: 100,
    color: "from-red-400 to-rose-500",
  },
  {
    icon: <FileSpreadsheet className="h-4 w-4" />,
    name: "inventory-export.xlsx",
    size: "864 KB",
    progress: 100,
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: <ImageIcon className="h-4 w-4" />,
    name: "site-survey-photos.zip",
    size: "18.2 MB",
    progress: 64,
    color: "from-sky-400 to-blue-500",
  },
] as const;

export function FileUploadVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur">
        <div className="flex items-center justify-between border-b border-border p-3">
          <div>
            <div className="text-xs font-semibold">Document Library</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              Contracts / 2026
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Lock className="h-2.5 w-2.5" />
            Access controlled
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-400/40 bg-brand-500/5 px-4 py-6 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/15 text-brand-600">
              <UploadCloud className="h-4 w-4" />
            </div>
            <div className="mt-2 text-xs font-medium">
              Drop files to upload
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              or <span className="font-medium text-brand-600">browse</span> —
              PDF, XLSX, images up to 50 MB
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-2.5"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${file.color} text-white`}
                >
                  {file.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-medium">
                      {file.name}
                    </span>
                    <span className="shrink-0 text-[9px] text-muted-foreground">
                      {file.size}
                    </span>
                  </div>
                  {file.progress < 100 ? (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-sky-500"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-medium text-brand-600">
                        {file.progress}%
                      </span>
                    </div>
                  ) : (
                    <div className="mt-0.5 flex items-center gap-1 text-[9px] text-emerald-600">
                      <CircleCheck className="h-2.5 w-2.5" />
                      Uploaded · encrypted at rest
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border p-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Storage used</span>
              <span className="font-medium text-foreground">
                4.2 GB / 10 GB
              </span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
