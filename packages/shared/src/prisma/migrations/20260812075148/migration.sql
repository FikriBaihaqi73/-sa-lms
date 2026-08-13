-- CreateTable
CREATE TABLE "module_contents" (
    "id" UUID NOT NULL,
    "module_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "content" TEXT,
    "file_id" UUID,
    "sort_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "module_contents_module_id_sort_order_idx" ON "module_contents"("module_id", "sort_order");

-- AddForeignKey
ALTER TABLE "module_contents" ADD CONSTRAINT "module_contents_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
