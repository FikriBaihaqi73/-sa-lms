import { z } from 'zod';

export const specializationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
});

export type Specialization = z.infer<typeof specializationSchema>;