-- CreateTable
CREATE TABLE "knowledge_chunks" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chunkType" TEXT NOT NULL,
    "drugNames" JSONB NOT NULL DEFAULT '[]',
    "severity" TEXT,
    "interactionId" TEXT,
    "embedding" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "drug_interactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
