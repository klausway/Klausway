type WidgetLoaderCtor = new (options: {
  container: HTMLElement;
  component: string;
  props: Record<string, unknown>;
}) => unknown;

declare global {
  interface Window {
    WidgetLoader?: WidgetLoaderCtor;
  }
}

export {};
