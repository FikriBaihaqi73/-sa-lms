import { Injectable, NotFoundException } from "@nestjs/common";
import { ClassRepository } from "@repo/shared/infrastructure/repository/class.repository";
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
      institution_id: dto.institution_id,
      academic_year_id: dto.academic_year_id,
      name: dto.name,
      grade_level: dto.grade_level,
      ...(dto.homeroom_teacher_id !== undefined
        ? { homeroom_teacher_id: dto.homeroom_teacher_id }
        : {}),
      ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
    });
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
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.classRepository.delete(id);
    return { success: true, id };
  }
}
