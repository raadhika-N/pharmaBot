-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "drugs" JSONB NOT NULL,
    "classifications" JSONB NOT NULL,
    "summary" JSONB NOT NULL,
    "narrative" TEXT NOT NULL,
    "overallRisk" TEXT NOT NULL,
    "actionItems" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reports_prescriptionId_key" ON "reports"("prescriptionId");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
