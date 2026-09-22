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
import { CreateFileDto, UpdateFileDto } from "@repo/shared/schemas/file.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { FilesService } from "./files.service";

@ApiTags("Files")
@ApiBearerAuth("JWT-auth")
@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @ApiOperation({ summary: "Get files with uploader, search and pagination" })
  async findAll(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
    @Query("search") search?: string,
  ) {
    const result = await this.filesService.findAll(page, limit, search);
    return ResponseHelper.success(
      result.data,
      "Files retrieved successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a file by ID with uploader" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return ResponseHelper.success(
      await this.filesService.findOne(id),
      "File detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a file record" })
  async create(@Body(new ZodValidationPipe()) dto: CreateFileDto) {
    return ResponseHelper.success(
      await this.filesService.create(dto),
      "File created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a file record" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe()) dto: UpdateFileDto,
  ) {
    return ResponseHelper.success(
      await this.filesService.update(id, dto),
      "File updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete a file record" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return ResponseHelper.success(
      await this.filesService.remove(id),
      "File deleted successfully",
    );
  }
}
