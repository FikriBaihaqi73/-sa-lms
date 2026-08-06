-- CreateTable
CREATE TABLE "academic_years" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "academic_year" VARCHAR NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_academic_year_key" ON "academic_years"("academic_year");
