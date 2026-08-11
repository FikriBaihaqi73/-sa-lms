-- CreateTable
CREATE TABLE "guardians" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "relationship" VARCHAR(255),
    "phone_number" VARCHAR(255),
    "email" VARCHAR(255),
    "address" TEXT,
    "occupation" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guardians_pkey" PRIMARY KEY ("id")
);
