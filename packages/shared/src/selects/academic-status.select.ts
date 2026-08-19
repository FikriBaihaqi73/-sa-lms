import type { Prisma } from "#generated/client";

export const academicStatusSelect = {
	id: true,
	name: true,
	description: true,
	created_at: true,
	updated_at: true,
	deleted_at: true,
} satisfies Prisma.AcademicStatusesSelect;

export type AcademicStatusSelectType = typeof academicStatusSelect;

export type AcademicStatusEntity = Prisma.AcademicStatusesGetPayload<{
	select: AcademicStatusSelectType;
}>;
