-- CreateEnum
CREATE TYPE "public"."EvaluationStatus" AS ENUM ('queued', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "public"."TaskType" AS ENUM ('cv', 'project', 'combined');

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" SERIAL NOT NULL,
    "extractedText" TEXT NOT NULL,
    "originalFilename" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evaluation_tasks" (
    "id" TEXT NOT NULL,
    "type" "public"."TaskType" NOT NULL DEFAULT 'cv',
    "cvDocumentId" INTEGER,
    "projectDocumentId" INTEGER,
    "status" "public"."EvaluationStatus" NOT NULL DEFAULT 'queued',
    "result" JSONB,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "evaluation_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."embeddings" (
    "id" TEXT NOT NULL,
    "documentId" INTEGER NOT NULL,
    "vector" DECIMAL(10,6)[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."evaluation_tasks" ADD CONSTRAINT "evaluation_tasks_cvDocumentId_fkey" FOREIGN KEY ("cvDocumentId") REFERENCES "public"."documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evaluation_tasks" ADD CONSTRAINT "evaluation_tasks_projectDocumentId_fkey" FOREIGN KEY ("projectDocumentId") REFERENCES "public"."documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."embeddings" ADD CONSTRAINT "embeddings_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
