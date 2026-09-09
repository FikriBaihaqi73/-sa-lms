import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateAcademicStatusDto,
  UpdateAcademicStatusDto,
} from "@repo/shared/schemas/academic-status.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { AcademicStatusService } from "./academic-status.service";

@ApiTags("Academic Statuses")
@Controller("academic-statuses")
export class AcademicStatusController {
  constructor(private readonly academicStatusService: AcademicStatusService) {}

  @Get()
  @ApiOperation({ summary: "Get all academic statuses" })
  async findAll() {
    const academicStatuses = await this.academicStatusService.findAll();
    return ResponseHelper.success(
      academicStatuses,
      "Academic statuses retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get academic status by ID" })
  async findOne(@Param("id") id: string) {
    const academicStatus = await this.academicStatusService.findOne(id);
    return ResponseHelper.success(
      academicStatus,
      "Academic status detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a new academic status" })
  async create(@Body(new ZodValidationPipe()) dto: CreateAcademicStatusDto) {
    const academicStatus = await this.academicStatusService.create(dto);
    return ResponseHelper.success(
      academicStatus,
      "Academic status created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing academic status" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateAcademicStatusDto,
  ) {
    const academicStatus = await this.academicStatusService.update(id, dto);
    return ResponseHelper.success(
      academicStatus,
      "Academic status updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an academic status" })
  async remove(@Param("id") id: string) {
    const result = await this.academicStatusService.remove(id);
    return ResponseHelper.success(
      result,
      "Academic status deleted successfully",
    );
  }
}
