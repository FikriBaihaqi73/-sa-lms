import type { Prisma } from "#generated/client";

export const employmentStatusSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.EmploymentStatusSelect;

export type EmploymentStatusSelectType = typeof employmentStatusSelect;

export type EmploymentStatusEntity = Prisma.EmploymentStatusGetPayload<{
  select: EmploymentStatusSelectType;
}>;
