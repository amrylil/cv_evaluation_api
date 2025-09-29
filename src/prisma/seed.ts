import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses seeding untuk Jobs...");

  const jobData = {
    title: "Backend Engineer",
    job_description_text: `
**Description**
You'll build new product features using our Agile methodology and address issues to ensure our codebase is clean. This role focuses on classic backend work and building AI-powered systems, integrating Large Language Models (LLMs) into our product ecosystem.

Key Responsibilities:
- Developing and maintaining high-performance server-side logic.
- Building LLM chaining flows and implementing Retrieval-Augmented Generation (RAG).
- Handling long-running AI processes with async background workers and retry mechanisms.
- Designing safeguards for managing failures from 3rd party APIs and LLM randomness.

**Required Qualifications**
We seek candidates with a strong backend track record, ideally with AI/LLM exposure.
- Experience with backend frameworks (Node.js, Django, Rails).
- Database management skills (MySQL, PostgreSQL).
- Familiarity with cloud technologies (AWS, Google Cloud).
- Understanding of LLM APIs, embeddings, vector databases, and prompt design.
- This is a remote role for candidates based in Indonesia.
      `,
  };

  const existingJob = await prisma.job.findFirst({
    where: {
      title: jobData.title,
      job_description_text: jobData.job_description_text,
    },
  });

  if (!existingJob) {
    await prisma.job.create({
      data: jobData,
    });
    console.log(`✅ Job "${jobData.title}" berhasil dibuat.`);
  } else {
    console.log(
      `🟡 Job "${jobData.title}" dengan deskripsi yang sama sudah ada, proses seeding dilewati.`
    );
  }

  console.log("✅ Seeding untuk Jobs selesai.");
}

main()
  .catch((e) => {
    console.error("Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
