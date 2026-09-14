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
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "@repo/shared/schemas/department.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { DepartmentsService } from "./departments.service";

@ApiTags("Departments")
@ApiBearerAuth("JWT-auth")
@Controller("departments")
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: "Get all departments with pagination and search" })
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const result = await this.departmentsService.findAll(pageNumber, limitNumber, {
      search,
    });
    return ResponseHelper.success(
      result.data,
      "Departments retrieved successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a department by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.departmentsService.findOne(id),
      "Department detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a department" })
  async create(@Body(new ZodValidationPipe()) dto: CreateDepartmentDto) {
    return ResponseHelper.success(
      await this.departmentsService.create(dto),
      "Department created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a department" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateDepartmentDto,
  ) {
    return ResponseHelper.success(
      await this.departmentsService.update(id, dto),
      "Department updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete a department" })
  async remove(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.departmentsService.remove(id),
      "Department deleted successfully",
    );
  }
}
