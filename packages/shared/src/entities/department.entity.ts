import type { Prisma } from "#generated/client";
import { departmentSelect } from "#selects/departments.select";

export type DepartmentEntity = Prisma.DepartmentsGetPayload<{
  select: typeof departmentSelect;
}>;

export type DepartmentListEntity = DepartmentEntity[];
