export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string | null;
  slug: string;
  date: string;
  status: "Not Started" | "In Progress" | "Completed" | "Archived";
  url?: string;
}

export interface Skill {
  name: string;
  icon: string;
  category: "Frontend" | "Backend" | "DevOps" | "Design" | "Other";
}

// CMS Content Types (admin-inline-cms)

export interface CareerItem {
  period: string;
  role: string;
  company: string;
}

export interface CertificationItem {
  name: string;
  date: string;
  issuer: string;
}

export interface AboutMeContent {
  heading: string;
  gradientClass: string;
  paragraphs: string[];
  career: CareerItem[];
  certifications: CertificationItem[];
}

export type SkillCategory = "Frontend" | "Backend" | "DevOps" | "Design" | "AI" | "Other";

export interface SkillContent {
  name: string;
  category: SkillCategory;
  usage: string;
}

export interface ContactContent {
  label: string;
  value: string;
  href: string;
  description: string;
  iconType: "email" | "github" | "external";
}

export interface ProjectMeta {
  id: string;
  pinned: boolean;
  hidden: boolean;
  order?: number;
}
