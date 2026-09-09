import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AcademicYearRepository } from "@repo/shared/infrastructure/repository/academic-year.repository";
import type {
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
} from "@repo/shared/schemas/academic-year.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AcademicYearService {
  private readonly academicYearRepository: AcademicYearRepository;

  constructor(private readonly prisma: PrismaService) {
    this.academicYearRepository = new AcademicYearRepository(
      this.prisma.client,
    );
  }

  async findAll() {
    return this.academicYearRepository.findAll();
  }

  async findOne(id: string) {
    const academicYear = await this.academicYearRepository.findById(id);
    if (!academicYear) {
      throw new NotFoundException("Academic year not found");
    }
    return academicYear;
  }

  async create(dto: CreateAcademicYearDto) {
    const existing = await this.academicYearRepository.findByAcademicYear(
      dto.academic_year,
    );
    if (existing) {
      throw new ConflictException("Academic year already exists");
    }

    return this.academicYearRepository.create({
      academic_year: dto.academic_year,
      is_active: dto.is_active,
    });
  }

  async update(id: string, dto: UpdateAcademicYearDto) {
    await this.findOne(id);

    if (dto.academic_year !== undefined) {
      const existing = await this.academicYearRepository.findByAcademicYear(
        dto.academic_year,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          "Academic year is already in use by another academic year",
        );
      }
    }

    return this.academicYearRepository.update(id, {
      ...(dto.academic_year !== undefined
        ? { academic_year: dto.academic_year }
        : {}),
      ...(dto.is_active !== undefined ? { is_active: dto.is_active } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.academicYearRepository.delete(id);
    return { success: true, id };
  }
}
