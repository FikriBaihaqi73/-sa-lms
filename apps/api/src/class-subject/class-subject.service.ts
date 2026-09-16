import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClassSubjectsRepository } from "@repo/shared/infrastructure/repository/class-subjects.repository";
import type {
  CreateClassSubjectDto,
  UpdateClassSubjectDto,
} from "@repo/shared/schemas/class-subject.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ClassSubjectService {
  private readonly repository: ClassSubjectsRepository;

  constructor(private readonly prisma: PrismaService) {
    this.repository = new ClassSubjectsRepository(this.prisma.client);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    return this.repository.findAll(page, limit, { search });
  }

  async findOne(id: string) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException("Class subject relation not found");
    }
    return record;
  }

  async findByClass(classId: string) {
    const classExists = await this.prisma.client.classes.findFirst({
      where: { id: classId, deleted_at: null },
    });
    if (!classExists) {
      throw new NotFoundException("Class not found");
    }
    return this.repository.findByClass(classId);
  }

  async findBySubject(subjectId: string) {
    const subjectExists = await this.prisma.client.subject.findFirst({
      where: { id: subjectId, deletedAt: null },
    });
    if (!subjectExists) {
      throw new NotFoundException("Subject not found");
    }
    return this.repository.findBySubject(subjectId);
  }

  async findByTeacher(teacherId: string) {
    const teacherExists = await this.prisma.client.teachers.findFirst({
      where: { id: teacherId, deleted_at: null },
    });
    if (!teacherExists) {
      throw new NotFoundException("Teacher not found");
    }
    return this.repository.findByTeacher(teacherId);
  }

  async findByAcademicYear(academicYearId: string) {
    const academicYearExists = await this.prisma.client.academicYears.findFirst(
      {
        where: { id: academicYearId, deleted_at: null },
      },
    );
    if (!academicYearExists) {
      throw new NotFoundException("Academic year not found");
    }
    return this.repository.findByAcademicYear(academicYearId);
  }

  async create(dto: CreateClassSubjectDto) {
    const classExists = await this.prisma.client.classes.findFirst({
      where: { id: dto.class_id, deleted_at: null },
    });
    if (!classExists) {
      throw new NotFoundException("Class not found");
    }

    const subjectExists = await this.prisma.client.subject.findFirst({
      where: { id: dto.subject_id, deletedAt: null },
    });
    if (!subjectExists) {
      throw new NotFoundException("Subject not found");
    }

    const teacherExists = await this.prisma.client.teachers.findFirst({
      where: { id: dto.teacher_id, deleted_at: null },
    });
    if (!teacherExists) {
      throw new NotFoundException("Teacher not found");
    }

    const academicYearExists = await this.prisma.client.academicYears.findFirst(
      {
        where: { id: dto.academic_year_id, deleted_at: null },
      },
    );
    if (!academicYearExists) {
      throw new NotFoundException("Academic year not found");
    }

    const existingCombination = await this.repository.findByUniqueCombination(
      dto.class_id,
      dto.subject_id,
      dto.teacher_id,
      dto.academic_year_id,
    );
    if (existingCombination) {
      throw new ConflictException(
        "Class subject relation already exists for this combination",
      );
    }

    return this.repository.create({
      class_id: dto.class_id,
      subject_id: dto.subject_id,
      teacher_id: dto.teacher_id,
      academic_year_id: dto.academic_year_id,
    });
  }

  async update(id: string, dto: UpdateClassSubjectDto) {
    const current = await this.findOne(id);

    const targetClassId = dto.class_id ?? current.class_id;
    const targetSubjectId = dto.subject_id ?? current.subject_id;
    const targetTeacherId = dto.teacher_id ?? current.teacher_id;
    const targetAcademicYearId =
      dto.academic_year_id ?? current.academic_year_id;

    if (dto.class_id !== undefined && dto.class_id !== current.class_id) {
      const classExists = await this.prisma.client.classes.findFirst({
        where: { id: dto.class_id, deleted_at: null },
      });
      if (!classExists) {
        throw new NotFoundException("Class not found");
      }
    }

    if (dto.subject_id !== undefined && dto.subject_id !== current.subject_id) {
      const subjectExists = await this.prisma.client.subject.findFirst({
        where: { id: dto.subject_id, deletedAt: null },
      });
      if (!subjectExists) {
        throw new NotFoundException("Subject not found");
      }
    }

    if (dto.teacher_id !== undefined && dto.teacher_id !== current.teacher_id) {
      const teacherExists = await this.prisma.client.teachers.findFirst({
        where: { id: dto.teacher_id, deleted_at: null },
      });
      if (!teacherExists) {
        throw new NotFoundException("Teacher not found");
      }
    }

    if (
      dto.academic_year_id !== undefined &&
      dto.academic_year_id !== current.academic_year_id
    ) {
      const academicYearExists =
        await this.prisma.client.academicYears.findFirst({
          where: { id: dto.academic_year_id, deleted_at: null },
        });
      if (!academicYearExists) {
        throw new NotFoundException("Academic year not found");
      }
    }

    if (
      targetClassId !== current.class_id ||
      targetSubjectId !== current.subject_id ||
      targetTeacherId !== current.teacher_id ||
      targetAcademicYearId !== current.academic_year_id
    ) {
      const existingCombination = await this.repository.findByUniqueCombination(
        targetClassId,
        targetSubjectId,
        targetTeacherId,
        targetAcademicYearId,
      );
      if (existingCombination && existingCombination.id !== id) {
        throw new ConflictException(
          "Class subject relation already exists for this combination",
        );
      }
    }

    return this.repository.update(id, {
      ...(dto.class_id !== undefined ? { class_id: dto.class_id } : {}),
      ...(dto.subject_id !== undefined ? { subject_id: dto.subject_id } : {}),
      ...(dto.teacher_id !== undefined ? { teacher_id: dto.teacher_id } : {}),
      ...(dto.academic_year_id !== undefined
        ? { academic_year_id: dto.academic_year_id }
        : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    const result = await this.repository.delete(id);
    return result;
  }
}
