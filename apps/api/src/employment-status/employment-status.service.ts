import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EmploymentStatusRepository } from "@repo/shared/infrastructure/repository/employment-status.repository";
import type {
  CreateEmploymentStatusDto,
  UpdateEmploymentStatusDto,
} from "@repo/shared/schemas/employment-status.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class EmploymentStatusService {
  private employmentStatusRepository: EmploymentStatusRepository;

  constructor(private readonly prisma: PrismaService) {
    this.employmentStatusRepository = new EmploymentStatusRepository(
      this.prisma.client,
    );
  }

  async findAll() {
    return this.employmentStatusRepository.findAll();
  }

  async findOne(id: string) {
    const employmentStatus = await this.employmentStatusRepository.findById(id);

    if (!employmentStatus) {
      throw new NotFoundException("Employment status not found");
    }

    return employmentStatus;
  }

  async create(dto: CreateEmploymentStatusDto) {
    const existing = await this.employmentStatusRepository.findByName(dto.name);

    if (existing) {
      throw new ConflictException("Employment status name already exists");
    }

    return this.employmentStatusRepository.create({
      name: dto.name,
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async update(id: string, dto: UpdateEmploymentStatusDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.employmentStatusRepository.findByName(
        dto.name,
      );

      if (existing && existing.id !== id) {
        throw new ConflictException(
          "Employment status name already in use by another employment status",
        );
      }
    }

    return this.employmentStatusRepository.update(id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.employmentStatusRepository.delete(id);

    return {
      success: true,
      id,
    };
  }
}
