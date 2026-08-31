import { z } from "zod";

export const employmentStatusSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
});

export type EmploymentStatus = z.infer<typeof employmentStatusSchema>;
