import { Lightbulb, Target, Eye, Users, Award, Shield } from "lucide-react";

export const aboutPageHeader = {
  subtitle:
    "Building technology that works for people, not the other way around.",
};

export const ourStory = {
  title: "Our Story",
  paragraphs: [
    "Klaus Way started with a simple idea: businesses shouldn't have to fight their technology to grow. Under Klausway Technology, we began by building customizable CRM systems for roofing companies—an industry that needed better tools to manage customers, leads, sales, and projects without unnecessary complexity. By bringing everything into one intuitive platform, we helped teams spend less time on admin work and more time building their businesses.",
    "As we worked closely with our clients, it became clear that the challenges we were solving weren't unique to roofing. Companies across industries were facing the same inefficiencies, outdated systems, and disconnected tools. That realization led to the next chapter.",
    "Klaus Way emerged with a broader mission: to create smart, flexible technology that helps businesses of all kinds work better. Today, we design and support solutions that adapt to how companies actually operate—scaling with them as they grow, and evolving as their needs change.",
    "Our story is still being written, but our focus remains the same: building technology that works for people, not the other way around.",
  ],
};

export const missionVision = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To empower businesses with innovative IT solutions that drive growth, efficiency, and competitive advantage in the digital age.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To be the most trusted partner for businesses seeking to transform their IT infrastructure and achieve digital excellence.",
  },
];

export const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Pushing boundaries with cutting-edge solutions",
  },
  {
    icon: Users,
    title: "Client-Focused",
    description: "Your success is our priority",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Delivering quality in every project",
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "Open communication and honest partnerships",
  },
];

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
  /** Local path (`/team/jim.jpg`) or remote URL (S3). Optional until a photo is attached. */
  image?: string | null;
  sortOrder?: number;
};

export const teamMembers: TeamMember[] = [
  {
    slug: "jim",
    name: "Jim",
    role: "Co-Owner and CEO",
    initials: "J",
    accent: "from-brand-500 to-indigo-600",
    image: "/team/jim.jpg",
    sortOrder: 0,
  },
  {
    slug: "marcus",
    name: "Marcus",
    role: "Head of Developer",
    initials: "M",
    accent: "from-sky-500 to-cyan-600",
    image: "/team/marcus.jpg",
    sortOrder: 1,
  },
  {
    slug: "faye",
    name: "Faye",
    role: "Developer",
    initials: "F",
    accent: "from-cyan-500 to-blue-600",
    image: "/team/faye.jpg",
    sortOrder: 2,
  },
  {
    slug: "mew",
    name: "Mew",
    role: "Developer",
    initials: "M",
    accent: "from-lime-500 to-emerald-600",
    image: "/team/mew.jpg",
    sortOrder: 3,
  },
];
