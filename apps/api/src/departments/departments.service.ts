import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DepartmentRepository } from "@repo/shared/infrastructure/repository/departments.repository";
import type {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "@repo/shared/schemas/department.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DepartmentsService {
  private readonly departmentRepository: DepartmentRepository;

  constructor(private readonly prisma: PrismaService) {
    this.departmentRepository = new DepartmentRepository(this.prisma.client);
  }

  async findAll() {
    return this.departmentRepository.findAll();
  }

  async findOne(id: string) {
    const department = await this.departmentRepository.findById(id);
    if (!department) throw new NotFoundException("Department not found");
    return department;
  }

  async create(dto: CreateDepartmentDto) {
    await this.ensureUniqueName(dto.name);
    return this.departmentRepository.create({
      name: dto.name,
      code: dto.code,
    });
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    await this.findOne(id);
    if (dto.name) {
      await this.ensureUniqueName(dto.name, id);
    }
    return this.departmentRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.code !== undefined && { code: dto.code }),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.departmentRepository.delete(id);
    return { success: true, id };
  }

  private async ensureUniqueName(name: string, excludedId?: string) {
    const existing = await this.departmentRepository.findByName(name);
    if (existing && existing.id !== excludedId) {
      throw new ConflictException("Department name already exists");
    }
  }
}
