import { Lightbulb, Users, Award, Shield } from "lucide-react";

export const aboutPageHeader = {
  subtitle:
    "Purpose-built technology for the way your business works. Start with a free consultation.",
};

export const ourStory = {
  title: "Our Story",
  paragraphs: [
    "Klaus Way started with a simple idea: businesses shouldn't have to fight their technology to grow. Under Klausway Technology, we began by building customizable CRM systems for roofing companies—an industry that needed better tools to manage customers, leads, sales, and projects without unnecessary complexity. By bringing everything into one intuitive platform, we helped teams spend less time on admin work and more time building their businesses.",
    "As we worked closely with our clients, it became clear that the challenges we were solving weren't unique to roofing. Companies across industries were facing the same inefficiencies, outdated systems, and disconnected tools. That realization led to the next chapter.",
    "The first of those systems was built for Klaus Larsen Roofing. The public product that grew from that work is Klaus Connect — our flagship all-in-one platform for customers, quotes, jobs, scheduling, and teams, at klaus-connect.com. We also build ApronConnect, branded online ordering for independent restaurants. Klaus Way continues to design, build, and run products and custom systems for companies that need more than one-size-fits-all software.",
    "Klaus Way emerged with a broader mission: to create smart, flexible technology that helps businesses of all kinds work better. Today, we design and support solutions that adapt to how companies actually operate—scaling with them as they grow, and evolving as their needs change.",
    "Our story is still being written, but our focus remains the same: we build, we connect, we simplify — technology that works for people, not the other way around.",
  ],
};

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
  /** Paragraphs; entries starting with "## " are headings shown only in the full bio. */
  bio?: string[];
  sortOrder?: number;
};

export const TEAM_BIO_HEADING_PREFIX = "## ";

export function isTeamBioHeading(entry: string) {
  return entry.startsWith(TEAM_BIO_HEADING_PREFIX);
}

export const teamMembers: TeamMember[] = [
  {
    slug: "jim",
    name: "Ravee “Jim” Tansangworn",
    role: "Co-Founder & CEO",
    initials: "RT",
    accent: "from-brand-500 to-indigo-600",
    image: "/team/jim.jpg",
    sortOrder: 0,
    bio: [
      "As Co-Founder and CEO of Klaus Way Technology, I guide the company’s vision, strategy, and growth. My focus is on understanding our clients’ challenges and bringing together the people, ideas, and technology to help solve them.",
      "My background spans information technology, finance, and business operations, including overseeing financial and technology systems at Klaus Larsen Roofing. This experience has shaped my practical approach to technology—connecting business needs with solutions that simplify daily operations and support growth.",
      "I believe strong leadership starts with listening, setting a clear direction, and empowering people to do their best work. My goal is to build a company known for dependable service, practical solutions, and lasting client relationships, helping businesses move forward with confidence as technology evolves.",
    ],
  },
  {
    slug: "marcus",
    name: "Marcus Yodkaset",
    role: "Head of Development",
    initials: "MY",
    accent: "from-sky-500 to-cyan-600",
    image: "/team/marcus.jpg",
    sortOrder: 1,
    bio: [
      "## Education and Early Career",
      "I graduated from Rajapruk University in Thailand with a bachelor’s degree in Computer Science. My career has grown from building internal business tools to developing platforms that support multiple companies, locations, and teams. Throughout that journey, my focus has been on understanding how people work and creating software that makes their day-to-day responsibilities easier.",
      "## 2019 - Early 2022: Building Business Systems at Tirawat Air Compressors",
      "I began my software engineering career at Tirawat Air Compressors in September 2019, developing systems for the customer service, service operations, and warehouse teams.",
      "One of my main projects was a complaints management application that helped employees record customer issues and follow each case through to resolution. It gave the team a more organized way to manage complaints and keep track of outstanding work.",
      "I also developed a service management website for the service and warehouse departments. By simplifying how employees entered and managed information, the system reduced administrative work by up to 30 minutes per job.",
      "These projects gave me practical experience turning everyday operational problems into useful software. They also helped me understand how decisions made during development affect the people who rely on a system every day.",
      "## 2022: Working on Transportation and Employee Systems",
      "After finishing my role at Tirawat in March 2022, I joined AIS as a contract Full Stack Developer from April to October.",
      "At AIS, I worked on a Transportation Management System, connecting it with external logistics services so that information could move between systems and support transportation workflows more automatically. I also helped maintain the connections used by company applications, including controls that kept access secure and prevented excessive usage.",
      "In November, I joined DoHome as a contract Software Engineer. There, I developed an employee attendance system that collected records from fingerprint and facial recognition scanners into one central database. By connecting existing equipment to the new system, we reduced the need to purchase replacement devices.",
      "I also built an internal SMS notification service and improved how messages were sent, reducing unnecessary usage by approximately 30% and lowering costs.",
      "Alongside these roles, I took on a freelance Human Resources Management System project, which ran from October 2022 to March 2023. The application brought payroll, attendance, and leave management into one place, helping the HR team work with connected information instead of maintaining separate records across departments.",
      "## 2023: Financial Services and Moving to the United States",
      "From March to September 2023, I worked as a contract Software Engineer at Kiatnakin Phatra Bank.",
      "My work supported mobile banking applications and an online loan service. I developed the services behind the applications, including functionality for verifying users and signing documents digitally. These features supported the loan application process and helped users complete important steps online.",
      "I also organized and improved the underlying data systems so that information could be retrieved efficiently during busy periods. One improvement reduced the time required to prepare data for application responses by approximately 25%.",
      "In 2023, I moved to the United States, beginning a new chapter in both my personal life and professional career.",
      "## 2024: Leading Freelance Projects and Working with Outlier AI",
      "In April 2024, I began working as a freelance Tech Lead for STOCKUP, an early-stage startup. The project continued through January 2025.",
      "I led the development of a real-time chat application for mobile phone retailers, designed to work inside a mobile app. The system supported more than 1,000 simultaneous connections per storefront without losing messages, helping retailers communicate reliably as activity increased.",
      "Between May and June 2024, I also developed a point-of-sale application for a public school. It supported more than 5,000 student accounts and daily inventory records, with particular attention to keeping information quick to find and practical to manage.",
      "From June to August 2024, I worked part-time at Outlier AI as a Software Development AI Trainer. I evaluated code generated by AI, checked its quality and correctness, and wrote clear explanations of errors, fixes, and potential improvements. This work supported the training and evaluation of AI systems for third-party clients.",
      "The role gave me experience assessing AI output critically and explaining technical decisions clearly, both of which continue to influence how I approach software development.",
      "## June 2024: Joining Klaus Larsen Roofing",
      "I joined Klaus Larsen Roofing in June 2024 as a contract Full Stack Developer, overlapping with my part-time work at Outlier AI.",
      "My early work included developing an internal business management application connected to the company’s existing FileMaker system. It supported internal users while providing a foundation that could be maintained and expanded as the business grew.",
      "I also improved the way the system retrieved information, reducing the time required for certain database requests from around 30 seconds to under 10 seconds. This helped employees access the information they needed more quickly.",
      "Another part of my work involved moving systems and data to cloud infrastructure and improving file storage. These changes helped reduce costs, improve reliability, and support the company’s expansion from two to four locations across Connecticut, Rhode Island, New York, and Massachusetts.",
      "## 2024 - Present: Expanding My Role at Klaus Larsen",
      "My responsibilities at Klaus Larsen have grown to include the company’s core business platform, products for other roofing companies, scheduling tools, AI features, and the infrastructure that keeps these systems running.",
      "A major project has been Klaus Connect, a custom platform developed to replace the company’s reliance on FileMaker. The goal was to remove limitations in the existing system and give the business more flexibility as its operations and number of users grew. During the transition, I kept the old and new systems running alongside each other so that daily work could continue.",
      "I also designed and developed a customer relationship management platform for multiple roofing companies. It became a commercial product used by businesses in Oregon, New York, and Connecticut. The platform included real-time pricing that displayed results in under a second, helping users access pricing information quickly.",
      "Another significant project was a centralized scheduling system for more than 150 employees and over 100 monthly service jobs across five states. Bringing schedules from multiple locations into one place improved workforce planning by approximately 40% and reduced scheduling conflicts by 65%.",
      "I introduced AI-assisted roof image analysis to help identify roofing materials and flag potential structural concerns in uploaded photos. This gave teams additional information to review before visiting a property for an on-site inspection.",
      "Alongside product development, I manage the cloud services that support these applications, including servers, databases, file storage, and access controls. I have also automated the process of releasing software updates and standardized how environments are set up for each company using the platform.",
      "Today, my work covers the full journey from understanding a business need to building, launching, and supporting the solution. I enjoy seeing software become part of a team’s everyday work, especially when it saves time, reduces costs, or helps a growing business operate more effectively.",
    ],
  },
  {
    slug: "faye",
    name: "Faye Sanguankum",
    role: "Developer",
    initials: "FS",
    accent: "from-cyan-500 to-blue-600",
    image: "/team/faye.jpg",
    sortOrder: 2,
    bio: [
      "With experience in Human Resources Information Systems (HRIS) at one of Thailand’s largest hospitals, I moved to the United States to study Information Systems. Today, I work in software support, helping users solve problems and contributing to software development and improvement.",
    ],
  },
  {
    slug: "kotchamon",
    name: "Kotchamon Saingpairoa",
    role: "Technical Content Developer",
    initials: "KS",
    accent: "from-lime-500 to-emerald-600",
    image: "/team/kotchamon.jpg",
    sortOrder: 3,
    bio: [
      "I develop and maintain the company’s technical content, from user guides and developer documentation to articles that help customers understand our products more easily. My main focus is turning complex topics into clear, practical content that people can actually use.",
      "I have 2 years of experience in this field and enjoy working closely with engineers and product teams to turn technical details into content that’s easy for everyone to follow. I believe good content should help readers get things done without needing to come back with more questions.",
    ],
  },
];
