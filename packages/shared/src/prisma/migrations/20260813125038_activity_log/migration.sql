-- CreateTable
CREATE TABLE "ActivityLogs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "module" VARCHAR NOT NULL,
    "action" VARCHAR NOT NULL,
    "table_name" VARCHAR,
    "record_id" UUID,
    "ip_address" VARCHAR,
    "user_agent" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLogs_user_id_idx" ON "ActivityLogs"("user_id");

-- CreateIndex
CREATE INDEX "ActivityLogs_module_idx" ON "ActivityLogs"("module");

-- CreateIndex
CREATE INDEX "ActivityLogs_action_idx" ON "ActivityLogs"("action");

-- CreateIndex
CREATE INDEX "ActivityLogs_created_at_idx" ON "ActivityLogs"("created_at");

-- AddForeignKey
ALTER TABLE "ActivityLogs" ADD CONSTRAINT "ActivityLogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
