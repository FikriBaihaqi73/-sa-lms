import { Injectable, NotFoundException } from "@nestjs/common";
import { GuardianRepository } from "@repo/shared/infrastructure/repository/guardian.repository";
import type {
  CreateGuardianDto,
  UpdateGuardianDto,
} from "@repo/shared/schemas/guardian.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GuardianService {
  private readonly guardianRepository: GuardianRepository;

  constructor(private readonly prisma: PrismaService) {
    this.guardianRepository = new GuardianRepository(this.prisma.client);
  }

  async findAll(
    page: number,
    limit: number,
    filters?: { search?: string | undefined },
  ) {
    return this.guardianRepository.findAll(page, limit, filters);
  }

  async findOne(id: string) {
    const guardian = await this.guardianRepository.findById(id);
    if (!guardian) throw new NotFoundException("Guardian not found");
    return guardian;
  }

  async create(dto: CreateGuardianDto) {
    return this.guardianRepository.create({
      fullName: dto.fullName,
      ...(dto.relationship !== undefined
        ? { relationship: dto.relationship }
        : {}),
      ...(dto.phoneNumber !== undefined
        ? { phoneNumber: dto.phoneNumber }
        : {}),
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.address !== undefined ? { address: dto.address } : {}),
      ...(dto.occupation !== undefined ? { occupation: dto.occupation } : {}),
    });
  }

  async update(id: string, dto: UpdateGuardianDto) {
    await this.findOne(id);
    return this.guardianRepository.update(id, {
      ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
      ...(dto.relationship !== undefined
        ? { relationship: dto.relationship }
        : {}),
      ...(dto.phoneNumber !== undefined
        ? { phoneNumber: dto.phoneNumber }
        : {}),
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.address !== undefined ? { address: dto.address } : {}),
      ...(dto.occupation !== undefined ? { occupation: dto.occupation } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.guardianRepository.delete(id);
    return { success: true, id };
  }
}
