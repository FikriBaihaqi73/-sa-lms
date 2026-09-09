import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InstitutionLevelRepository } from "@repo/shared/infrastructure/repository/institution-level.repository";
import type {
  CreateInstitutionLevelDto,
  UpdateInstitutionLevelDto,
} from "@repo/shared/schemas/institution-level.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class InstitutionLevelService {
  private readonly institutionLevelRepository: InstitutionLevelRepository;

  constructor(private readonly prisma: PrismaService) {
    this.institutionLevelRepository = new InstitutionLevelRepository(
      this.prisma.client,
    );
  }

  async findAll() {
    return this.institutionLevelRepository.findAll();
  }

  async findOne(id: string) {
    const institutionLevel = await this.institutionLevelRepository.findById(id);
    if (!institutionLevel) {
      throw new NotFoundException("Institution level not found");
    }
    return institutionLevel;
  }

  async create(dto: CreateInstitutionLevelDto) {
    const existing = await this.institutionLevelRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException("Institution level name already exists");
    }

    return this.institutionLevelRepository.create({
      name: dto.name,
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async update(id: string, dto: UpdateInstitutionLevelDto) {
    await this.findOne(id);

    if (dto.name !== undefined) {
      const existing = await this.institutionLevelRepository.findByName(
        dto.name,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          "Institution level name already in use by another institution level",
        );
      }
    }

    return this.institutionLevelRepository.update(id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.institutionLevelRepository.delete(id);
    return { success: true, id };
  }
}
