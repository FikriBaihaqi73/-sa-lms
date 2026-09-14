import type { Prisma } from "#generated/client";

export const studentSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,

  profileId: true,
  departmentId: true,
  academicStatusId: true,
  studentNumber: true,
  enrollmentYear: true,

  assignmentSubmissions: {
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      assignmentId: true,
      studentId: true,
      submittedAt: true,
      score: true,
      feedback: true,
      status: true,
      gradedBy: true,
      gradedAt: true,

      assignment: {
        select: {
          id: true,
          module_id: true,
          assignment_type_id: true,
          title: true,
          description: true,
          due_date: true,
          max_score: true,

          assignment_type: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },

          module: {
            select: {
              id: true,
              title: true,

              class_subject: {
                select: {
                  id: true,
                  class_id: true,
                  subject_id: true,
                  teacher_id: true,
                  academic_year_id: true,

                  teacher: true,
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.StudentSelect;

export type StudentEntity = Prisma.StudentGetPayload<{
  select: typeof studentSelect;
}>;