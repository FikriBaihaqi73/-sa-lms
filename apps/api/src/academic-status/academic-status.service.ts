import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AcademicStatusRepository } from "@repo/shared/infrastructure/repository/academic-status.repository";
import type {
  CreateAcademicStatusDto,
  UpdateAcademicStatusDto,
} from "@repo/shared/schemas/academic-status.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AcademicStatusService {
  private readonly academicStatusRepository: AcademicStatusRepository;

  constructor(private readonly prisma: PrismaService) {
    this.academicStatusRepository = new AcademicStatusRepository(
      this.prisma.client,
    );
  }

  async findAll() {
    return this.academicStatusRepository.findAll();
  }

  async findOne(id: string) {
    const academicStatus = await this.academicStatusRepository.findById(id);
    if (!academicStatus) {
      throw new NotFoundException("Academic status not found");
    }
    return academicStatus;
  }

  async create(dto: CreateAcademicStatusDto) {
    const existing = await this.academicStatusRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException("Academic status name already exists");
    }

    return this.academicStatusRepository.create({
      name: dto.name,
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async update(id: string, dto: UpdateAcademicStatusDto) {
    await this.findOne(id);

    if (dto.name !== undefined) {
      const existing = await this.academicStatusRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          "Academic status name already in use by another academic status",
        );
      }
    }

    return this.academicStatusRepository.update(id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.academicStatusRepository.delete(id);
    return { success: true, id };
  }
}
