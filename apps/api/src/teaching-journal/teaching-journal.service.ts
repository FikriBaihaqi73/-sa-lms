import { Injectable, NotFoundException } from "@nestjs/common";
import { TeachingJournalRepository } from "@repo/shared/infrastructure/repository/journals.repository";
import { ScheduleRepository } from "@repo/shared/infrastructure/repository/schedule.repository";
import type {
  CreateTeachingJournalDto,
  UpdateTeachingJournalDto,
} from "@repo/shared/schemas/teaching-journal.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TeachingJournalService {
  private readonly scheduleRepository: ScheduleRepository;
  private readonly teachingJournalRepository: TeachingJournalRepository;

  constructor(private readonly prisma: PrismaService) {
    this.scheduleRepository = new ScheduleRepository(this.prisma.client);
    this.teachingJournalRepository = new TeachingJournalRepository(
      this.prisma.client,
    );
  }

  async findAll() {
    return this.teachingJournalRepository.findAll();
  }

  async findOne(id: string) {
    const journal = await this.teachingJournalRepository.findById(id);
    if (!journal) throw new NotFoundException("Teaching journal not found");
    return journal;
  }

  async create(dto: CreateTeachingJournalDto) {
    await this.ensureScheduleExists(dto.schedule_id);
    return this.teachingJournalRepository.create({
      schedule_id: dto.schedule_id,
      ...(dto.meeting_number !== undefined
        ? { meeting_number: dto.meeting_number }
        : {}),
      ...(dto.journal_date !== undefined
        ? { journal_date: new Date(dto.journal_date) }
        : {}),
      ...(dto.topic !== undefined ? { topic: dto.topic } : {}),
      ...(dto.material !== undefined ? { material: dto.material } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
    });
  }

  async update(id: string, dto: UpdateTeachingJournalDto) {
    await this.findOne(id);
    if (dto.schedule_id !== undefined) {
      await this.ensureScheduleExists(dto.schedule_id);
    }

    return this.teachingJournalRepository.update(id, {
      ...(dto.schedule_id !== undefined
        ? { schedule_id: dto.schedule_id }
        : {}),
      ...(dto.meeting_number !== undefined
        ? { meeting_number: dto.meeting_number }
        : {}),
      ...(dto.journal_date !== undefined
        ? { journal_date: new Date(dto.journal_date) }
        : {}),
      ...(dto.topic !== undefined ? { topic: dto.topic } : {}),
      ...(dto.material !== undefined ? { material: dto.material } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.teachingJournalRepository.delete(id);
    return { success: true, id };
  }

  private async ensureScheduleExists(scheduleId: string) {
    const schedule = await this.scheduleRepository.findById(scheduleId);
    if (!schedule) throw new NotFoundException("Schedule not found");
  }
}
