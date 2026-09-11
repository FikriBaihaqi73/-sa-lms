import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InstitutionLevelRepository } from "@repo/shared/infrastructure/repository/institution-level.repository";
import {
  type CreateInstitutionInput,
  InstitutionRepository,
  type UpdateInstitutionInput,
} from "@repo/shared/infrastructure/repository/institution.repository";
import type {
  CreateInstitutionDto,
  UpdateInstitutionDto,
} from "@repo/shared/schemas/institution.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class InstitutionService {
  private readonly institutionLevelRepository: InstitutionLevelRepository;
  private readonly institutionRepository: InstitutionRepository;

  constructor(private readonly prisma: PrismaService) {
    this.institutionLevelRepository = new InstitutionLevelRepository(
      this.prisma.client,
    );
    this.institutionRepository = new InstitutionRepository(this.prisma.client);
  }

  async findAll() {
    return this.institutionRepository.findAll();
  }

  async findOne(id: string) {
    const institution = await this.institutionRepository.findById(id);
    if (!institution) throw new NotFoundException("Institution not found");
    return institution;
  }

  async create(dto: CreateInstitutionDto) {
    await this.ensureRelationsExist(dto.institutionLevelId);
    
    const input: CreateInstitutionInput = {
      institutionLevelId: dto.institutionLevelId,
      name: dto.name,
      ...(dto.shortName !== undefined && { shortName: dto.shortName }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.city !== undefined && { city: dto.city }),
      ...(dto.province !== undefined && { province: dto.province }),
      ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
      ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.website !== undefined && { website: dto.website }),
      ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
    };

    return this.institutionRepository.create(input);
  }

  async update(id: string, dto: UpdateInstitutionDto) {
    await this.findOne(id);
    if (dto.institutionLevelId) {
        await this.ensureRelationsExist(dto.institutionLevelId);
    }
    
    const input: UpdateInstitutionInput = {
      ...(dto.institutionLevelId !== undefined && { institutionLevelId: dto.institutionLevelId }),
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.shortName !== undefined && { shortName: dto.shortName }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.city !== undefined && { city: dto.city }),
      ...(dto.province !== undefined && { province: dto.province }),
      ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
      ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.website !== undefined && { website: dto.website }),
      ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
    };

    return this.institutionRepository.update(id, input);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.institutionRepository.delete(id);
    return { success: true, id };
  }

  private async ensureRelationsExist(institutionLevelId: string) {
    const institutionLevel = await this.institutionLevelRepository.findById(institutionLevelId);
    if (!institutionLevel) throw new NotFoundException("Institution level not found");
  }
}
