import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
} from "@repo/shared/schemas/academic-year.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AcademicYearService } from "./academic-year.service";

@ApiTags("Academic Years")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("academic-years")
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Get()
  @ApiOperation({ summary: "Get all academic years" })
  async findAll() {
    const academicYears = await this.academicYearService.findAll();
    return ResponseHelper.success(
      academicYears,
      "Academic years retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get academic year by ID" })
  async findOne(@Param("id") id: string) {
    const academicYear = await this.academicYearService.findOne(id);
    return ResponseHelper.success(
      academicYear,
      "Academic year detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a new academic year" })
  async create(@Body(new ZodValidationPipe()) dto: CreateAcademicYearDto) {
    const academicYear = await this.academicYearService.create(dto);
    return ResponseHelper.success(
      academicYear,
      "Academic year created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing academic year" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateAcademicYearDto,
  ) {
    const academicYear = await this.academicYearService.update(id, dto);
    return ResponseHelper.success(
      academicYear,
      "Academic year updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an academic year" })
  async remove(@Param("id") id: string) {
    const result = await this.academicYearService.remove(id);
    return ResponseHelper.success(result, "Academic year deleted successfully");
  }
}
