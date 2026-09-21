import { Injectable, NotFoundException } from "@nestjs/common";
import {
  AnnouncementsRepository,
  type CreateAnnouncementInput,
  type UpdateAnnouncementInput,
} from "@repo/shared/infrastructure/repository/announcements.repository";
import { InstitutionRepository } from "@repo/shared/infrastructure/repository/institution.repository";
import type {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from "@repo/shared/schemas/announcement.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnnouncementService {
  private readonly announcementRepository: AnnouncementsRepository;
  private readonly institutionRepository: InstitutionRepository;

  constructor(private readonly prisma: PrismaService) {
    this.announcementRepository = new AnnouncementsRepository(
      this.prisma.client,
    );
    this.institutionRepository = new InstitutionRepository(this.prisma.client);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    return this.announcementRepository.findAll(page, limit, { search });
  }

  async findOne(id: string) {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) {
      throw new NotFoundException("Announcement not found");
    }
    return announcement;
  }

  async create(dto: CreateAnnouncementDto) {
    await this.ensureInstitutionExists(dto.institutionId);

    const input: CreateAnnouncementInput = {
      institution_id: dto.institutionId,
      title: dto.title,
      ...(dto.content !== undefined && { content: dto.content }),
      ...(dto.isPublished !== undefined && {
        is_published: dto.isPublished,
      }),
      ...(dto.publishedAt !== undefined && {
        published_at: new Date(dto.publishedAt),
      }),
      ...(dto.expiredAt !== undefined && {
        expired_at: new Date(dto.expiredAt),
      }),
    };

    return this.announcementRepository.create(input);
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    await this.findOne(id);

    if (dto.institutionId !== undefined) {
      await this.ensureInstitutionExists(dto.institutionId);
    }

    const input: UpdateAnnouncementInput = {
      ...(dto.institutionId !== undefined && {
        institution_id: dto.institutionId,
      }),
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.content !== undefined && { content: dto.content }),
      ...(dto.isPublished !== undefined && {
        is_published: dto.isPublished,
      }),
      ...(dto.publishedAt !== undefined && {
        published_at: new Date(dto.publishedAt),
      }),
      ...(dto.expiredAt !== undefined && {
        expired_at: new Date(dto.expiredAt),
      }),
    };

    return this.announcementRepository.update(id, input);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.announcementRepository.delete(id);
    return { success: true, id };
  }

  private async ensureInstitutionExists(institutionId: string) {
    const institution =
      await this.institutionRepository.findById(institutionId);
    if (!institution) {
      throw new NotFoundException("Institution not found");
    }
  }
}
