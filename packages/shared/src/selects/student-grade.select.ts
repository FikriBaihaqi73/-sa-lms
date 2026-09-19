import type { Prisma } from "#generated/client";
import { academicYearSelect } from "#selects/academic-year.select";
import { classSubjectsSelect } from "#selects/class-subjects.select";
import { gradeSelect } from "#selects/grades.select";
import { studentSelect } from "#selects/students.select";

export const studentGradeSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,

  studentId: true,
  classSubjectId: true,
  academicYearId: true,
  assignmentScore: true,
  quizScore: true,
  midExamScore: true,
  finalExamScore: true,
  finalScore: true,
  gradeId: true,
  remarks: true,

  student: {
    select: studentSelect,
  },
  classSubject: {
    select: classSubjectsSelect,
  },
  academicYear: {
    select: academicYearSelect,
  },
  grade: {
    select: gradeSelect,
  },
} satisfies Prisma.StudentGradesSelect;

export type StudentGradeSelectType = typeof studentGradeSelect;

export type StudentGradeEntity = Prisma.StudentGradesGetPayload<{
  select: StudentGradeSelectType;
}>;
