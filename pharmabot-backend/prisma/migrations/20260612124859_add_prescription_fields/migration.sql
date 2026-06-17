-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "drugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "filePath" TEXT,
ADD COLUMN     "fileType" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
