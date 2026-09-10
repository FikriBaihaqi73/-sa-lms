import { ConflictException, NotFoundException } from "@nestjs/common";
import { AttendanceStatusRepository } from "@repo/shared/infrastructure/repository/attendance-status.repository";
import type {
  CreateAttendanceStatusDto,
  UpdateAttendanceStatusDto,
} from "@repo/shared/schemas/attendance-status.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { AttendanceStatusService } from "./attendance-status.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("AttendanceStatusService", () => {
  let service: AttendanceStatusService;

  beforeEach(() => {
    service = new AttendanceStatusService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns all active attendance statuses", async () => {
    const statuses = [{ id: "present-id", name: "Present" }];
    jest
      .spyOn(AttendanceStatusRepository.prototype, "findAll")
      .mockResolvedValue(statuses as never);

    await expect(service.findAll()).resolves.toEqual(statuses);
  });

  it("rejects a missing attendance status", async () => {
    jest
      .spyOn(AttendanceStatusRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects a duplicate name during creation", async () => {
    jest
      .spyOn(AttendanceStatusRepository.prototype, "findByName")
      .mockResolvedValue({ id: "present-id" } as never);

    await expect(
      service.create({ name: "Present" } as CreateAttendanceStatusDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("allows retaining the same name when updating", async () => {
    jest
      .spyOn(AttendanceStatusRepository.prototype, "findById")
      .mockResolvedValue({ id: "present-id" } as never);
    jest
      .spyOn(AttendanceStatusRepository.prototype, "findByName")
      .mockResolvedValue({ id: "present-id" } as never);
    const update = jest
      .spyOn(AttendanceStatusRepository.prototype, "update")
      .mockResolvedValue({ id: "present-id" } as never);

    await service.update("present-id", {
      name: "Present",
    } as UpdateAttendanceStatusDto);

    expect(update).toHaveBeenCalledWith("present-id", { name: "Present" });
  });

  it("soft-deletes an existing attendance status", async () => {
    jest
      .spyOn(AttendanceStatusRepository.prototype, "findById")
      .mockResolvedValue({ id: "present-id" } as never);
    const remove = jest
      .spyOn(AttendanceStatusRepository.prototype, "delete")
      .mockResolvedValue({ id: "present-id" } as never);

    await expect(service.remove("present-id")).resolves.toEqual({
      success: true,
      id: "present-id",
    });
    expect(remove).toHaveBeenCalledWith("present-id");
  });
});
