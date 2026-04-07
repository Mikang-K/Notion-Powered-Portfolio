"use client";

import { motion } from "framer-motion";

const skills = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "PostgreSQL", category: "Backend" },
  { name: "Docker", category: "DevOps" },
  { name: "Vercel", category: "DevOps" },
  { name: "Git", category: "DevOps" },
  { name: "Notion API", category: "Other" },
  { name: "Figma", category: "Design" },
];

const categoryColors: Record<string, string> = {
  Frontend: "from-violet-500/10 to-indigo-500/10 border-violet-200 dark:border-violet-800",
  Backend: "from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800",
  DevOps: "from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-800",
  Design: "from-pink-500/10 to-rose-500/10 border-pink-200 dark:border-pink-800",
  Other: "from-neutral-500/10 to-slate-500/10 border-neutral-200 dark:border-neutral-800",
};

const categories = ["Frontend", "Backend", "DevOps", "Design", "Other"];

export function Skills() {
  return (
    <section id="skills" data-section="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Skills
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-12">
          주로 사용하는 기술 스택입니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            if (categorySkills.length === 0) return null;
            return (
              <div key={category}>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="flex flex-col gap-2">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`px-4 py-2 rounded-lg border bg-gradient-to-br text-sm font-medium text-neutral-700 dark:text-neutral-300 ${categoryColors[category]}`}
                    >
                      {skill.name}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
