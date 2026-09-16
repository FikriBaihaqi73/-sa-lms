import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  ClassQueryDto,
  CreateClassDto,
  UpdateClassDto,
} from "@repo/shared/schemas/class.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { ClassService } from "./class.service";

@ApiTags("Classes")
@ApiBearerAuth("JWT-auth")
@Controller("classes")
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  @ApiOperation({ summary: "Get classes with search and pagination" })
  async findAll(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
    @Query("search") search?: string,
  ) {
    const classes = await this.classService.findAll(page, limit, search);
    return ResponseHelper.success(classes, "Classes retrieved successfully");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get class by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.classService.findOne(id),
      "Class retrieved successfully",
  @ApiOperation({ summary: "Get all classes with pagination and search" })
  async findAll(@Query(new ZodValidationPipe()) query: ClassQueryDto) {
    const result = await this.classService.findAll(
      query.page ?? 1,
      query.limit ?? 10,
      { search: query.search },
    );

    return ResponseHelper.success(
      result.data,
      "Classes retrieved successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a class by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.classService.findOne(id),
      "Class detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a class" })
  async create(@Body(new ZodValidationPipe()) dto: CreateClassDto) {
    return ResponseHelper.success(
      await this.classService.create(dto),
      "Class created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a class" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateClassDto,
  ) {
    return ResponseHelper.success(
      await this.classService.update(id, dto),
      "Class updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a class" })
  @ApiOperation({ summary: "Soft-delete a class" })
  async remove(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.classService.remove(id),
      "Class deleted successfully",
    );
  }
}
}
