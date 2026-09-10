import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SpecializationRepository } from "@repo/shared/infrastructure/repository/specialization.repository";
import type {
  CreateSpecializationDto,
  UpdateSpecializationDto,
} from "@repo/shared/schemas/specialization.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SpecializationService {
  private specializationRepository: SpecializationRepository;

  constructor(private readonly prisma: PrismaService) {
    this.specializationRepository = new SpecializationRepository(this.prisma.client);
  }

  async findAll() {
    return this.specializationRepository.findAll();
  }

  async findOne(id: string) {
    const specialization = await this.specializationRepository.findById(id);
    if (!specialization) {
      throw new NotFoundException("Specialization not found");
    }
    return specialization;
  }

  async create(dto: CreateSpecializationDto) {
    const existing = await this.specializationRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException("Specialization name already exists");
    }
    return this.specializationRepository.create({
      name: dto.name,
      ...(dto.description ? { description: dto.description } : {}),
    });
  }

  async update(id: string, dto: UpdateSpecializationDto) {
    await this.findOne(id);
    if (dto.name) {
      const existing = await this.specializationRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException("Specialization name already in use by another specialization");
      }
    }
    return this.specializationRepository.update(id, {
      ...(dto.name ? { name: dto.name } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description ?? undefined }
        : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.specializationRepository.delete(id);
    return { success: true, id };
  }
}
