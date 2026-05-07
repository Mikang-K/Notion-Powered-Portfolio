import { AboutMe } from "@/components/AboutMe";
import { Contact } from "@/components/Contact";
import { ProjectList } from "@/components/ProjectList";
import { Sidebar } from "@/components/Sidebar";
import { Skills } from "@/components/Skills";
import { getProjects } from "@/lib/notion";
import { auth } from "@/lib/auth";
import { getContent } from "@/lib/kv";
import { defaultAbout, defaultSkills, defaultContacts } from "@/lib/defaults";

export const revalidate = 3600;

export default async function Home() {
  const [session, projects, aboutContent, skillsContent, contactContent] = await Promise.all([
    auth().catch(() => null),
    getProjects(),
    getContent("portfolio:about", defaultAbout),
    getContent("portfolio:skills", defaultSkills),
    getContent("portfolio:contact", defaultContacts),
  ]);

  const isAdmin = session?.user?.isAdmin ?? false;

  return (
    <div className="flex min-h-screen pt-14">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <AboutMe content={aboutContent} isAdmin={isAdmin} />
        <ProjectList projects={projects} isAdmin={isAdmin} />
        <Skills content={skillsContent} isAdmin={isAdmin} />
        <Contact content={contactContent} isAdmin={isAdmin} />
      </main>
    </div>
  );
}
