import { Injectable, NotFoundException } from "@nestjs/common";
import { ProfileRepository } from "@repo/shared/infrastructure/repository/profile.repository";
import type {
  CreateProfileDto,
  UpdateProfileDto,
} from "@repo/shared/schemas/profile.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor(private readonly prisma: PrismaService) {
    this.profileRepository = new ProfileRepository(this.prisma.client);
  }

  async findAll() {
    return this.profileRepository.findAll();
  }

  async findOne(id: string) {
    const profile = await this.profileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException("Profile not found");
    }
    return profile;
  }

  async create(dto: CreateProfileDto) {
    return this.profileRepository.create({
      userId: dto.userId,
      institutionId: dto.institutionId,
      fullName: dto.fullName,
      ...(dto.identityNumber !== undefined ? { identityNumber: dto.identityNumber } : {}),
      ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
      ...(dto.birthPlace !== undefined ? { birthPlace: dto.birthPlace } : {}),
      ...(dto.birthDate !== undefined ? { birthDate: new Date(dto.birthDate) } : {}),
      ...(dto.religionId !== undefined ? { religionId: dto.religionId } : {}),
      ...(dto.nationalityId !== undefined ? { nationalityId: dto.nationalityId } : {}),
      ...(dto.address !== undefined ? { address: dto.address } : {}),
      ...(dto.phoneNumber !== undefined ? { phoneNumber: dto.phoneNumber } : {}),
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.photoUrl !== undefined ? { photoUrl: dto.photoUrl } : {}),
    });
  }

  async update(id: string, dto: UpdateProfileDto) {
    await this.findOne(id);
    return this.profileRepository.update(id, {
      ...(dto.institutionId !== undefined ? { institutionId: dto.institutionId } : {}),
      ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
      ...(dto.identityNumber !== undefined ? { identityNumber: dto.identityNumber } : {}),
      ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
      ...(dto.birthPlace !== undefined ? { birthPlace: dto.birthPlace } : {}),
      ...(dto.birthDate !== undefined ? { birthDate: new Date(dto.birthDate) } : {}),
      ...(dto.religionId !== undefined ? { religionId: dto.religionId } : {}),
      ...(dto.nationalityId !== undefined ? { nationalityId: dto.nationalityId } : {}),
      ...(dto.address !== undefined ? { address: dto.address } : {}),
      ...(dto.phoneNumber !== undefined ? { phoneNumber: dto.phoneNumber } : {}),
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.photoUrl !== undefined ? { photoUrl: dto.photoUrl } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.profileRepository.delete(id);
    return { success: true, id };
  }
}
