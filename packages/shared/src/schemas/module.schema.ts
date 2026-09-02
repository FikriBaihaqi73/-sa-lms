import { z } from "zod";

export const moduleSchema = z.object({
  id: z.string().uuid(),
  created_by: z.string().uuid().nullable(),
  updated_by: z.string().uuid().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
  deleted_at: z.date().nullable(),
  class_subject_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  display_order: z.number().int().nullable(),
  is_published: z.boolean().nullable(),
  is_locked: z.boolean().nullable(),
});

export type Module = z.infer<typeof moduleSchema>;
