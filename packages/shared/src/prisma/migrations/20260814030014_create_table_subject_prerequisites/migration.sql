-- CreateTable
CREATE TABLE "subject_prerequisites" (
    "id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "prerequisite_subject_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subject_prerequisites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subject_prerequisites_subject_id_prerequisite_subject_id_key" ON "subject_prerequisites"("subject_id", "prerequisite_subject_id");

-- AddForeignKey
ALTER TABLE "subject_prerequisites" ADD CONSTRAINT "subject_prerequisites_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_prerequisites" ADD CONSTRAINT "subject_prerequisites_prerequisite_subject_id_fkey" FOREIGN KEY ("prerequisite_subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
