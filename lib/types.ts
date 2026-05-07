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
