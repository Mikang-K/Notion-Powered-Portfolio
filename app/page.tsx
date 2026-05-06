import { AboutMe } from "@/components/AboutMe";
import { Contact } from "@/components/Contact";
import { ProjectList } from "@/components/ProjectList";
import { Sidebar } from "@/components/Sidebar";
import { Skills } from "@/components/Skills";
import { getProjects } from "@/lib/notion";

export const revalidate = 3600;

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="flex min-h-screen pt-14">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <AboutMe />
        <ProjectList projects={projects} />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}
