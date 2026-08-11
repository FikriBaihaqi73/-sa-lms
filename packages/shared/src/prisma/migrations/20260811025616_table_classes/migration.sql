-- CreateTable
CREATE TABLE "Classes" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "homeroom_teacher_id" UUID,
    "academic_year_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "grade_level" INTEGER NOT NULL,
    "capacity" INTEGER,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Classes_institution_id_idx" ON "Classes"("institution_id");

-- CreateIndex
CREATE INDEX "Classes_homeroom_teacher_id_idx" ON "Classes"("homeroom_teacher_id");

-- CreateIndex
CREATE INDEX "Classes_academic_year_id_idx" ON "Classes"("academic_year_id");

-- CreateIndex
CREATE INDEX "Classes_name_idx" ON "Classes"("name");

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_homeroom_teacher_id_fkey" FOREIGN KEY ("homeroom_teacher_id") REFERENCES "Teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
