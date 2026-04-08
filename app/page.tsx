import { Hero } from "@/components/Hero";
import { ProjectList } from "@/components/ProjectList";
import { Skills } from "@/components/Skills";
import { getProjects } from "@/lib/notion";

export const revalidate = 3600; // ISR: 1시간마다 재생성

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Hero />
      <ProjectList projects={projects} />
      <Skills />
    </>
  );
}
