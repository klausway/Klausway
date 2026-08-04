declare global {
  namespace JSX {
    interface IntrinsicElements {
      "vapi-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "public-key"?: string;
        "assistant-id"?: string;
        mode?: "chat" | "voice" | "hybrid" | string;
        theme?: "light" | "dark" | string;
        position?: string;
        size?: string;
        radius?: string;
        "accent-color"?: string;
        "button-base-color"?: string;
        "button-accent-color"?: string;
        "main-label"?: string;
        "empty-chat-message"?: string;
      };
    }
  }
}

export {};
