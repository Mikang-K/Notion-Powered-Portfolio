export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string | null;
  slug: string;
  date: string;
  status: "In Progress" | "Completed" | "Archived";
}

export interface Skill {
  name: string;
  icon: string;
  category: "Frontend" | "Backend" | "DevOps" | "Design" | "Other";
}
