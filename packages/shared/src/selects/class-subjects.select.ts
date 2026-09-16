import type { Prisma } from "#generated/client";
import { academicYearSelect } from "./academic-year.select.js";
import { classSelect } from "./class.select.js";
import { subjectSelect } from "./subject.select.js";
import { teacherSelect } from "./teacher.select.js";

export const classSubjectsSelect = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  class_id: true,
  subject_id: true,
  teacher_id: true,
  academic_year_id: true,
  class: {
    select: classSelect,
  },
  subject: {
    select: subjectSelect,
  },
  teacher: {
    select: teacherSelect,
  },
  academic_year: {
    select: academicYearSelect,
  },
} satisfies Prisma.ClassSubjectsSelect;

export type ClassSubjectsSelectType = typeof classSubjectsSelect;

export type ClassSubjectsEntity = Prisma.ClassSubjectsGetPayload<{
  select: ClassSubjectsSelectType;
}>;
