import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateActivityLogDto,
  UpdateActivityLogDto,
} from "@repo/shared/schemas/activity-logs.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { ActivityLogService } from "./activity-log.service";

@ApiTags("Activity Logs")
@ApiBearerAuth("JWT-auth")
@Controller("activity-logs")
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @ApiOperation({ summary: "Get all activity logs with pagination and search" })
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const result = await this.activityLogService.findAll(
      pageNumber,
      limitNumber,
      {
        search,
      },
    );
    return ResponseHelper.success(
      result.data,
      "Activity logs retrieved successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an activity log by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.activityLogService.findOne(id),
      "Activity log detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create an activity log" })
  async create(@Body(new ZodValidationPipe()) dto: CreateActivityLogDto) {
    return ResponseHelper.success(
      await this.activityLogService.create(dto),
      "Activity log created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an activity log" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateActivityLogDto,
  ) {
    return ResponseHelper.success(
      await this.activityLogService.update(id, dto),
      "Activity log updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete an activity log" })
  async remove(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.activityLogService.remove(id),
      "Activity log deleted successfully",
    );
  }
}
