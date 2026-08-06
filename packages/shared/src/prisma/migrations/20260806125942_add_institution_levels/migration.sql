-- CreateTable
CREATE TABLE "InstitutionLevel" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "create_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "InstitutionLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionLevel_name_key" ON "InstitutionLevel"("name");

-- CreateIndex
CREATE INDEX "InstitutionLevel_name_idx" ON "InstitutionLevel"("name");
