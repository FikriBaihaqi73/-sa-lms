import type { Prisma } from "#generated/client";
import { employmentStatusSelect } from "#selects/employment-status.select";

export type EmploymentStatusEntity = Prisma.EmploymentStatusGetPayload<{
	select: typeof employmentStatusSelect;
}>;

export type EmploymentStatusListEntity = EmploymentStatusEntity[];
