"use client";

import { cn } from "@/lib/utils";
import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const TOOLBAR_ACTIONS = [
  {
    label: "Bold",
    icon: Bold,
    command: "bold",
  },
  {
    label: "Italic",
    icon: Italic,
    command: "italic",
  },
  {
    label: "Underline",
    icon: Underline,
    command: "underline",
  },
  {
    label: "Bulleted list",
    icon: List,
    command: "insertUnorderedList",
  },
  {
    label: "Numbered list",
    icon: ListOrdered,
    command: "insertOrderedList",
  },
] as const;

const sanitizeHtml = (value: string) =>
  value.replace(/<\/?(script|style)[^>]*>/gi, "").trim();

const getPlainText = (value: string) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start typing...",
  className,
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleCommand = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command);
    onChange(sanitizeHtml(editorRef.current?.innerHTML ?? ""));
  };

  const plainText = getPlainText(value);
  const isEmpty = plainText.length === 0;

  return (
    <div
      className={cn(
        "rounded-[18px] border bg-background transition",
        isFocused
          ? "border-landing-primary shadow-[0_0_0_4px_rgba(57,182,255,0.12)]"
          : "border-border",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-3 py-2">
        {TOOLBAR_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.command}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleCommand(action.command)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-title transition hover:border-landing-primary hover:text-landing-primary"
              aria-label={action.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
      <div className="relative px-3 py-3">
        {isEmpty ? (
          <span className="pointer-events-none absolute left-3 top-3 text-sm text-placeholder">
            {placeholder}
          </span>
        ) : null}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          className="min-h-[180px] text-sm leading-6 outline-none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onChange(sanitizeHtml(editorRef.current?.innerHTML ?? ""));
          }}
          onInput={(event) =>
            onChange(sanitizeHtml(event.currentTarget.innerHTML))
          }
        />
      </div>
    </div>
  );
};
