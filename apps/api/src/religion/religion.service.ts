import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ReligionRepository } from "@repo/shared/infrastructure/repository/religions.repository";
import type {
  CreateReligionDto,
  UpdateReligionDto,
} from "@repo/shared/schemas/religion.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReligionService {
  private readonly religionRepository: ReligionRepository;

  constructor(private readonly prisma: PrismaService) {
    this.religionRepository = new ReligionRepository(this.prisma.client);
  }

  findAll() {
    return this.religionRepository.findAll();
  }

  async findOne(id: string) {
    const religion = await this.religionRepository.findById(id);
    if (!religion) {
      throw new NotFoundException("Religion not found");
    }
    return religion;
  }

  async create(dto: CreateReligionDto) {
    const existing = await this.religionRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException("Religion name already exists");
    }
    return this.religionRepository.create({ name: dto.name });
  }

  async update(id: string, dto: UpdateReligionDto) {
    await this.findOne(id);

    if (dto.name !== undefined) {
      const existing = await this.religionRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException("Religion name already exists");
      }
    }

    return this.religionRepository.update(id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.religionRepository.delete(id);
    return { success: true, id };
  }
}
