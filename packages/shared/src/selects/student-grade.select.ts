import type { Prisma } from "#generated/client";

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
} satisfies Prisma.StudentGradesSelect;

export type StudentGradeSelectType = typeof studentGradeSelect;

export type StudentGradeEntity = Prisma.StudentGradesGetPayload<{
  select: StudentGradeSelectType;
}>;