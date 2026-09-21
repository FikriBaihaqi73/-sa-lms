import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from "@repo/shared/schemas/announcement.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { AnnouncementService } from "./announcement.service";

@ApiTags("Announcements")
@ApiBearerAuth("JWT-auth")
@Controller("announcements")
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @ApiOperation({
    summary:
      "Get announcements with institution and user relations, pagination and search",
  })
  async findAll(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
    @Query("search") search?: string,
  ) {
    const result = await this.announcementService.findAll(page, limit, search);
    return ResponseHelper.success(
      result.data,
      "Announcements retrieved successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an announcement by ID with relations" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return ResponseHelper.success(
      await this.announcementService.findOne(id),
      "Announcement detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create an announcement" })
  async create(@Body(new ZodValidationPipe()) dto: CreateAnnouncementDto) {
    return ResponseHelper.success(
      await this.announcementService.create(dto),
      "Announcement created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an announcement" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe()) dto: UpdateAnnouncementDto,
  ) {
    return ResponseHelper.success(
      await this.announcementService.update(id, dto),
      "Announcement updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete an announcement" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return ResponseHelper.success(
      await this.announcementService.remove(id),
      "Announcement deleted successfully",
    );
  }
}
