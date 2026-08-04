import { permanentRedirect } from "next/navigation";
import { routes } from "@/lib/navigation";

/** Legacy /blog → /resources */
export default function BlogIndexRedirect() {
  permanentRedirect(routes.resources);
}
