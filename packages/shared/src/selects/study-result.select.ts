import type { Prisma } from "#generated/client";
import { academicStatusSelect } from "#selects/academic-status.select";
import { academicYearSelect } from "#selects/academic-year.select";
import { semesterSelect } from "#selects/semester.select";
import { studentSelect } from "#selects/students.select";

export const studyResultSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  studentId: true,
  academicYearId: true,
  semesterId: true,
  totalCredits: true,
  semesterGpa: true,
  cumulativeGpa: true,
  academicStatusId: true,

  student: {
    select: studentSelect,
  },
  academicYear: {
    select: academicYearSelect,
  },
  semester: {
    select: semesterSelect,
  },
  academicStatus: {
    select: academicStatusSelect,
  },
} satisfies Prisma.StudyResultSelect;

export type StudyResultSelectType = typeof studyResultSelect;

export type StudyResultEntity = Prisma.StudyResultGetPayload<{
  select: StudyResultSelectType;
}>;
