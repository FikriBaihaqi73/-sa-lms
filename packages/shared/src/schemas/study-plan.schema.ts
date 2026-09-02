import { z } from "zod";

export const studyPlanSchema = z.object({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
  student_id: z.string().uuid(),
  class_subject_id: z.string().uuid(),
  academic_year_id: z.string().uuid(),
});

export type StudyPlan = z.infer<typeof studyPlanSchema>;
