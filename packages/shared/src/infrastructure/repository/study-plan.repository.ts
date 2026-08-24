import type { PrismaClient } from "#generated/client";
import {
  type StudyPlanEntity,
  studyPlanSelect,
} from "#selects/study-plan.select";

export interface CreateStudyPlanInput {
  student_id: string;
  class_subject_id: string;
  academic_year_id: string;
}

export interface UpdateStudyPlanInput {
  student_id?: string;
  class_subject_id?: string;
  academic_year_id?: string;
}

export class StudyPlanRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateStudyPlanInput): Promise<StudyPlanEntity> {
    return this.prisma.studyPlans.create({
      data: {
        student_id: data.student_id,
        class_subject_id: data.class_subject_id,
        academic_year_id: data.academic_year_id,
      },
      select: studyPlanSelect,
    });
  }

  async findById(id: string): Promise<StudyPlanEntity | null> {
    return this.prisma.studyPlans.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: studyPlanSelect,
    });
  }

  async findAll(): Promise<StudyPlanEntity[]> {
    return this.prisma.studyPlans.findMany({
      where: {
        deleted_at: null,
      },
      select: studyPlanSelect,
    });
  }

  async update(
    id: string,
    data: UpdateStudyPlanInput,
  ): Promise<StudyPlanEntity> {
    return this.prisma.studyPlans.update({
      where: {
        id,
      },
      data: {
        ...(data.student_id !== undefined && {
          student_id: data.student_id,
        }),
        ...(data.class_subject_id !== undefined && {
          class_subject_id: data.class_subject_id,
        }),
        ...(data.academic_year_id !== undefined && {
          academic_year_id: data.academic_year_id,
        }),
      },
      select: studyPlanSelect,
    });
  }

  async delete(id: string): Promise<StudyPlanEntity> {
    return this.prisma.studyPlans.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: studyPlanSelect,
    });
  }
}