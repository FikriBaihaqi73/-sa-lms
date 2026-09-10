import { NotFoundException } from "@nestjs/common";
import { TeachingJournalRepository } from "@repo/shared/infrastructure/repository/journals.repository";
import { ScheduleRepository } from "@repo/shared/infrastructure/repository/schedule.repository";
import type { CreateTeachingJournalDto } from "@repo/shared/schemas/teaching-journal.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { TeachingJournalService } from "./teaching-journal.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("TeachingJournalService", () => {
  let service: TeachingJournalService;

  beforeEach(() => {
    service = new TeachingJournalService({} as PrismaService);
    jest
      .spyOn(ScheduleRepository.prototype, "findById")
      .mockResolvedValue({ id: "schedule-id" } as never);
  });

  afterEach(() => jest.restoreAllMocks());

  it("rejects creation when the schedule does not exist", async () => {
    jest
      .spyOn(ScheduleRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(
      service.create({} as CreateTeachingJournalDto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("creates a journal and converts its ISO date to Date", async () => {
    const create = jest
      .spyOn(TeachingJournalRepository.prototype, "create")
      .mockResolvedValue({ id: "journal-id" } as never);

    await service.create({
      schedule_id: "schedule-id",
      meeting_number: 1,
      journal_date: "2026-09-10T00:00:00.000Z",
      topic: "Introduction",
    } as CreateTeachingJournalDto);

    expect(create).toHaveBeenCalledWith({
      schedule_id: "schedule-id",
      meeting_number: 1,
      journal_date: new Date("2026-09-10T00:00:00.000Z"),
      topic: "Introduction",
    });
  });

  it("updates and soft-deletes an existing journal", async () => {
    jest
      .spyOn(TeachingJournalRepository.prototype, "findById")
      .mockResolvedValue({ id: "journal-id" } as never);
    const update = jest
      .spyOn(TeachingJournalRepository.prototype, "update")
      .mockResolvedValue({ id: "journal-id" } as never);
    const remove = jest
      .spyOn(TeachingJournalRepository.prototype, "delete")
      .mockResolvedValue({ id: "journal-id" } as never);

    await service.update("journal-id", { notes: "Completed" });
    await expect(service.remove("journal-id")).resolves.toEqual({
      success: true,
      id: "journal-id",
    });

    expect(update).toHaveBeenCalledWith("journal-id", { notes: "Completed" });
    expect(remove).toHaveBeenCalledWith("journal-id");
  });
});
