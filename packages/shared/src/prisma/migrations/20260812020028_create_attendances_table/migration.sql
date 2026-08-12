-- CreateTable
CREATE TABLE "Attendances" (
    "id" UUID NOT NULL,
    "schedule_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "attendance_status_id" UUID NOT NULL,
    "attendance_date" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "Attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attendances_schedule_id_idx" ON "Attendances"("schedule_id");

-- CreateIndex
CREATE INDEX "Attendances_student_id_idx" ON "Attendances"("student_id");

-- CreateIndex
CREATE INDEX "Attendances_attendance_status_id_idx" ON "Attendances"("attendance_status_id");

-- CreateIndex
CREATE UNIQUE INDEX "Attendances_schedule_id_student_id_attendance_date_key" ON "Attendances"("schedule_id", "student_id", "attendance_date");

-- AddForeignKey
ALTER TABLE "Attendances" ADD CONSTRAINT "Attendances_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendances" ADD CONSTRAINT "Attendances_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendances" ADD CONSTRAINT "Attendances_attendance_status_id_fkey" FOREIGN KEY ("attendance_status_id") REFERENCES "attendance_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
