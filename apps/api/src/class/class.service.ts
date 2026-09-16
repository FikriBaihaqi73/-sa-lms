import { Injectable, NotFoundException } from "@nestjs/common";
import { ClassRepository } from "@repo/shared/infrastructure/repository/class.repository";
import { AcademicYearRepository } from "@repo/shared/infrastructure/repository/academic-year.repository";
import {
  ClassRepository,
  type CreateClassInput,
  type UpdateClassInput,
} from "@repo/shared/infrastructure/repository/class.repository";
import { InstitutionRepository } from "@repo/shared/infrastructure/repository/institution.repository";
import { TeacherRepository } from "@repo/shared/infrastructure/repository/teacher.repository";
import type {
  CreateClassDto,
  UpdateClassDto,
} from "@repo/shared/schemas/class.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ClassService {
  private readonly classRepository: ClassRepository;

  constructor(private readonly prisma: PrismaService) {
    this.classRepository = new ClassRepository(this.prisma.client);
  }

  findAll(page = 1, limit = 10, search?: string) {
    return this.classRepository.findAll({
      page,
      limit,
      ...(search !== undefined ? { search } : {}),
    });
  private readonly academicYearRepository: AcademicYearRepository;
  private readonly institutionRepository: InstitutionRepository;
  private readonly teacherRepository: TeacherRepository;

  constructor(private readonly prisma: PrismaService) {
    const client = this.prisma.client;
    this.classRepository = new ClassRepository(client);
    this.academicYearRepository = new AcademicYearRepository(client);
    this.institutionRepository = new InstitutionRepository(client);
    this.teacherRepository = new TeacherRepository(client);
  }

  async findAll(
    page: number,
    limit: number,
    filters?: { search?: string | undefined },
  ) {
    return this.classRepository.findAll(page, limit, filters);
  }

  async findOne(id: string) {
    const classEntity = await this.classRepository.findById(id);
    if (!classEntity) {
      throw new NotFoundException("Class not found");
    }
    return classEntity;
  }

  create(dto: CreateClassDto) {
    return this.classRepository.create({
    if (!classEntity) throw new NotFoundException("Class not found");
    return classEntity;
  }

  async create(dto: CreateClassDto) {
    await this.ensureRelationsExist(
      dto.institution_id,
      dto.academic_year_id,
      dto.homeroom_teacher_id,
    );

    const input: CreateClassInput = {
      institution_id: dto.institution_id,
      academic_year_id: dto.academic_year_id,
      name: dto.name,
      grade_level: dto.grade_level,
      ...(dto.homeroom_teacher_id !== undefined
        ? { homeroom_teacher_id: dto.homeroom_teacher_id }
        : {}),
      ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
    });
      ...(dto.homeroom_teacher_id !== undefined && {
        homeroom_teacher_id: dto.homeroom_teacher_id,
      }),
      ...(dto.capacity !== undefined && { capacity: dto.capacity }),
    };

    return this.classRepository.create(input);
  }

  async update(id: string, dto: UpdateClassDto) {
    await this.findOne(id);
    return this.classRepository.update(id, {
      ...(dto.institution_id !== undefined
        ? { institution_id: dto.institution_id }
        : {}),
      ...(dto.homeroom_teacher_id !== undefined
        ? { homeroom_teacher_id: dto.homeroom_teacher_id }
        : {}),
      ...(dto.academic_year_id !== undefined
        ? { academic_year_id: dto.academic_year_id }
        : {}),
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.grade_level !== undefined ? { grade_level: dto.grade_level } : {}),
      ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
    });
    await this.ensureRelationsExist(
      dto.institution_id,
      dto.academic_year_id,
      dto.homeroom_teacher_id,
    );

    const input: UpdateClassInput = {
      ...(dto.institution_id !== undefined && {
        institution_id: dto.institution_id,
      }),
      ...(dto.homeroom_teacher_id !== undefined && {
        homeroom_teacher_id: dto.homeroom_teacher_id,
      }),
      ...(dto.academic_year_id !== undefined && {
        academic_year_id: dto.academic_year_id,
      }),
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.grade_level !== undefined && { grade_level: dto.grade_level }),
      ...(dto.capacity !== undefined && { capacity: dto.capacity }),
    };

    return this.classRepository.update(id, input);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.classRepository.delete(id);
    return { success: true, id };
  }
}

  private async ensureRelationsExist(
    institutionId?: string,
    academicYearId?: string,
    homeroomTeacherId?: string | null,
  ) {
    if (institutionId !== undefined) {
      const institution =
        await this.institutionRepository.findById(institutionId);
      if (!institution) throw new NotFoundException("Institution not found");
    }

    if (academicYearId !== undefined) {
      const academicYear =
        await this.academicYearRepository.findById(academicYearId);
      if (!academicYear) throw new NotFoundException("Academic year not found");
    }

    if (homeroomTeacherId) {
      const teacher = await this.teacherRepository.findById(homeroomTeacherId);
      if (!teacher) throw new NotFoundException("Homeroom teacher not found");
    }
  }
}
