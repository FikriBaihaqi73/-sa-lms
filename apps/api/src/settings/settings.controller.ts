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
  CreateSettingDto,
  UpdateSettingDto,
} from "@repo/shared/schemas/setting.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { SettingsService } from "./settings.service";

@ApiTags("Settings")
@ApiBearerAuth("JWT-auth")
@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new setting" })
  async create(
    @Body(new ZodValidationPipe()) createSettingDto: CreateSettingDto,
  ) {
    const result = await this.settingsService.create(createSettingDto);
    return ResponseHelper.success(result, "Setting created successfully", 201);
  }

  @Get()
  @ApiOperation({ summary: "Get all settings with pagination and search" })
  async findAll(
    @Query("page") page = "1",
    @Query("limit") limit = "10",
    @Query("search") search?: string,
  ) {
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const result = await this.settingsService.findAll(pageNumber, limitNumber, {
      ...(search !== undefined ? { search } : {}),
    });
    return ResponseHelper.success(
      result.data,
      "Settings fetched successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get setting by id" })
  async findOne(@Param("id") id: string) {
    const result = await this.settingsService.findOne(id);
    return ResponseHelper.success(result, "Setting fetched successfully");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update setting by id" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) updateSettingDto: UpdateSettingDto,
  ) {
    const result = await this.settingsService.update(id, updateSettingDto);
    return ResponseHelper.success(result, "Setting updated successfully");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete setting by id" })
  async remove(@Param("id") id: string) {
    const result = await this.settingsService.remove(id);
    return ResponseHelper.success(result, "Setting deleted successfully");
  }
}
