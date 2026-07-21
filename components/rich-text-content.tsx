import { cn } from "@/lib/utils";
import { sanitizeRichText } from "@/lib/rich-text";

type RichTextContentProps = {
  html: string;
  className?: string;
};

export function RichTextContent({ html, className }: RichTextContentProps) {
  const sanitized = sanitizeRichText(html);
  if (!sanitized) return null;

  return (
    <div
      className={cn(
        "rich-text prose max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground",
        "prose-h2:mt-10 prose-h2:text-3xl prose-h3:mt-8 prose-h3:text-2xl",
        "prose-p:text-muted-foreground prose-p:leading-relaxed",
        "prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline",
        "prose-blockquote:border-brand-400/40 prose-blockquote:text-muted-foreground",
        "prose-li:text-muted-foreground",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
