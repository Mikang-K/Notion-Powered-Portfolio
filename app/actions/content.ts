"use server";

import { auth } from "@/lib/auth";
import { setContent } from "@/lib/kv";
import { revalidatePath } from "next/cache";
import type { AboutMeContent, SkillContent, ContactContent, ProjectMeta } from "@/lib/types";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error("UNAUTHORIZED");
}

export async function saveAboutContent(data: AboutMeContent) {
  await assertAdmin();
  await setContent("portfolio:about", data);
  revalidatePath("/");
}

export async function saveSkills(data: SkillContent[]) {
  await assertAdmin();
  await setContent("portfolio:skills", data);
  revalidatePath("/");
}

export async function saveContact(data: ContactContent[]) {
  await assertAdmin();
  await setContent("portfolio:contact", data);
  revalidatePath("/");
}

export async function saveProjectsMeta(data: ProjectMeta[]) {
  await assertAdmin();
  await setContent("portfolio:projects-meta", data);
  revalidatePath("/");
}
