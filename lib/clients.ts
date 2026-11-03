export type Client = {
  name: string;
  /** Short location or note shown under the name. */
  location?: string;
  /** Optional logo path under /public when available. */
  logo?: string;
  href?: string;
};

/** Companies we build for — logo optional until assets are added. */
export const clients: Client[] = [
  {
    name: "Klaus Larsen Roofing",
    location: "Connecticut",
  },
  {
    name: "Klaus Roofing Systems of Oregon",
    location: "Oregon",
  },
];
