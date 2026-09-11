import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { NationalityRepository } from "@repo/shared/infrastructure/repository/nationalities.repository";
import type {
  CreateNationalityDto,
  UpdateNationalityDto,
} from "@repo/shared/schemas/nationality.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NationalityService {
  private readonly nationalityRepository: NationalityRepository;

  constructor(private readonly prisma: PrismaService) {
    this.nationalityRepository = new NationalityRepository(this.prisma.client);
  }

  async findAll() {
    return this.nationalityRepository.findAll();
  }

  async findOne(id: string) {
    const nationality = await this.nationalityRepository.findById(id);
    if (!nationality) {
      throw new NotFoundException("Nationality not found");
    }
    return nationality;
  }

  async create(dto: CreateNationalityDto) {
    const existing = await this.nationalityRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException("Nationality name already exists");
    }

    return this.nationalityRepository.create({
      name: dto.name,
      ...(dto.description !== undefined && dto.description !== null
        ? { description: dto.description }
        : {}),
    });
  }

  async update(id: string, dto: UpdateNationalityDto) {
    await this.findOne(id);

    if (dto.name !== undefined) {
      const existing = await this.nationalityRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          "Nationality name already in use by another nationality",
        );
      }
    }

    return this.nationalityRepository.update(id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.nationalityRepository.delete(id);
    return { success: true, id };
  }
}
