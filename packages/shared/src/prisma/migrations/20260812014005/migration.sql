-- CreateTable
CREATE TABLE "schedules" (
    "id" UUID NOT NULL,
    "class_subject_id" UUID NOT NULL,
    "classroom_id" UUID NOT NULL,
    "day" TEXT NOT NULL,
    "start_time" TIME(0),
    "end_time" TIME(0),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);
