import type { Prisma } from "#generated/client";

export const departmentSelect = {
	id: true,
	name: true,
	code: true,
	created_at: true,
	updated_at: true,
	deleted_at: true,
} satisfies Prisma.DepartmentsSelect;

export type DepartmentSelectType = typeof departmentSelect;

export type DepartmentEntity = Prisma.DepartmentsGetPayload<{
	select: DepartmentSelectType;
}>;
