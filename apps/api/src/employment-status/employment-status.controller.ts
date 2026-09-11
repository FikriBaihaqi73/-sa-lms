import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateEmploymentStatusDto,
  UpdateEmploymentStatusDto,
} from "@repo/shared/schemas/employment-status.schema";
import { EmploymentStatusService } from "./employment-status.service";

@ApiTags("Employment Statuses")
@ApiBearerAuth("JWT-auth")
@Controller("employment-statuses")
export class EmploymentStatusController {
  constructor(
    private readonly employmentStatusService: EmploymentStatusService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all employment statuses" })
  async findAll() {
    const employmentStatuses = await this.employmentStatusService.findAll();
    return ResponseHelper.success(
      employmentStatuses,
      "Employment statuses retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get employment status by ID" })
  async findOne(@Param("id") id: string) {
    const employmentStatus = await this.employmentStatusService.findOne(id);
    return ResponseHelper.success(
      employmentStatus,
      "Employment status detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a new employment status" })
  async create(@Body() createEmploymentStatusDto: CreateEmploymentStatusDto) {
    const employmentStatus = await this.employmentStatusService.create(
      createEmploymentStatusDto,
    );
    return ResponseHelper.success(
      employmentStatus,
      "Employment status created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing employment status" })
  async update(
    @Param("id") id: string,
    @Body() updateEmploymentStatusDto: UpdateEmploymentStatusDto,
  ) {
    const employmentStatus = await this.employmentStatusService.update(
      id,
      updateEmploymentStatusDto,
    );
    return ResponseHelper.success(
      employmentStatus,
      "Employment status updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an employment status" })
  async remove(@Param("id") id: string) {
    const result = await this.employmentStatusService.remove(id);
    return ResponseHelper.success(
      result,
      "Employment status deleted successfully",
    );
  }
}
