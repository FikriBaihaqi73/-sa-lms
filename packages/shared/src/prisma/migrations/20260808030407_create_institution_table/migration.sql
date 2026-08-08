-- CreateTable
CREATE TABLE "institutions" (
    "id" UUID NOT NULL,
    "institution_level_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "short_name" VARCHAR(255),
    "address" TEXT,
    "city" VARCHAR(255),
    "province" VARCHAR(255),
    "postal_code" VARCHAR(255),
    "phone_number" VARCHAR(255),
    "email" VARCHAR(255),
    "website" VARCHAR(255),
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_institution_level_id_fkey" FOREIGN KEY ("institution_level_id") REFERENCES "InstitutionLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
