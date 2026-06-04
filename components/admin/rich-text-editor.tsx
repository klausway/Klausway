"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Underline,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeRichText } from "@/lib/rich-text";

type RichTextEditorProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
};

type ToolbarAction = {
  label: string;
  icon: typeof Bold;
  command: () => void;
};

export function RichTextEditor({
  label,
  hint,
  value,
  onChange,
  placeholder = "Write formatted content…",
  minHeight = "220px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const syncFromProp = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const normalized = normalizeRichText(value);
    if (editor.innerHTML !== normalized) {
      editor.innerHTML = normalized || "";
    }
  }, [value]);

  useEffect(() => {
    if (focused) return;
    syncFromProp();
  }, [syncFromProp, focused]);

  function emitChange() {
    const editor = editorRef.current;
    if (!editor) return;
    onChange(editor.innerHTML);
  }

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emitChange();
  }

  function insertLink() {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    runCommand("createLink", url);
  }

  const toolbar: ToolbarAction[] = [
    { label: "Bold", icon: Bold, command: () => runCommand("bold") },
    { label: "Italic", icon: Italic, command: () => runCommand("italic") },
    { label: "Underline", icon: Underline, command: () => runCommand("underline") },
    { label: "Heading 2", icon: Heading2, command: () => runCommand("formatBlock", "h2") },
    { label: "Heading 3", icon: Heading3, command: () => runCommand("formatBlock", "h3") },
    { label: "Bullet list", icon: List, command: () => runCommand("insertUnorderedList") },
    {
      label: "Numbered list",
      icon: ListOrdered,
      command: () => runCommand("insertOrderedList"),
    },
    { label: "Quote", icon: Quote, command: () => runCommand("formatBlock", "blockquote") },
    { label: "Link", icon: Link2, command: insertLink },
  ];

  return (
    <div className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {hint ? (
        <span className="mb-1.5 block text-xs text-muted-foreground">{hint}</span>
      ) : null}

      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-background/80 transition-colors",
          focused ? "border-brand-400/50 ring-1 ring-brand-400/20" : "border-white/10",
        )}
      >
        <div className="flex flex-wrap gap-1 border-b border-white/10 bg-white/[0.02] p-2">
          {toolbar.map(({ label: actionLabel, icon: Icon, command }) => (
            <button
              key={actionLabel}
              type="button"
              title={actionLabel}
              aria-label={actionLabel}
              onMouseDown={(event) => {
                event.preventDefault();
                command();
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline
          aria-label={label}
          data-placeholder={placeholder}
          suppressContentEditableWarning
          onInput={emitChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "rich-text-editor px-3.5 py-3 text-sm outline-none",
            "prose prose-invert max-w-none prose-p:my-3 prose-headings:my-4",
          )}
          style={{ minHeight }}
        />
      </div>
    </div>
  );
}
