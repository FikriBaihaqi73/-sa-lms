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
  @ApiOperation({ summary: "Get all departments" })
  async findAll() {
    return ResponseHelper.success(
      await this.departmentsService.findAll(),
      "Departments retrieved successfully",
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
