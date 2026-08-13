-- CreateTable
CREATE TABLE "Assignments" (
    "id" UUID NOT NULL,
    "module_id" UUID NOT NULL,
    "assignment_type_id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP,
    "max_score" DECIMAL(65,30),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "Assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assignments_module_id_idx" ON "Assignments"("module_id");

-- CreateIndex
CREATE INDEX "Assignments_assignment_type_id_idx" ON "Assignments"("assignment_type_id");

-- AddForeignKey
ALTER TABLE "Assignments" ADD CONSTRAINT "Assignments_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignments" ADD CONSTRAINT "Assignments_assignment_type_id_fkey" FOREIGN KEY ("assignment_type_id") REFERENCES "AssignmentTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
