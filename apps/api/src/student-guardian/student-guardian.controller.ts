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
  CreateStudentGuardianDto,
  UpdateStudentGuardianDto,
} from "@repo/shared/schemas/student-guardian.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { StudentGuardianService } from "./student-guardian.service";

@ApiTags("Student Guardians")
@ApiBearerAuth("JWT-auth")
@Controller("student-guardians")
export class StudentGuardianController {
  constructor(
    private readonly studentGuardianService: StudentGuardianService,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Get all student guardian relations with pagination and search",
  })
  async findAll(
    @Query("page") page = "1",
    @Query("limit") limit = "10",
    @Query("search") search?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const result = await this.studentGuardianService.findAll(
      pageNumber,
      limitNumber,
      search,
    );
    return ResponseHelper.success(
      result.data,
      "Student guardian relations retrieved successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get student guardian relation by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.studentGuardianService.findOne(id),
      "Student guardian relation retrieved successfully",
    );
  }

  @Get("student/:studentId")
  @ApiOperation({ summary: "Get guardians for a specific student" })
  async findByStudentId(@Param("studentId") studentId: string) {
    return ResponseHelper.success(
      await this.studentGuardianService.findByStudentId(studentId),
      "Student guardians retrieved successfully",
    );
  }

  @Get("guardian/:guardianId")
  @ApiOperation({ summary: "Get students for a specific guardian" })
  async findByGuardianId(@Param("guardianId") guardianId: string) {
    return ResponseHelper.success(
      await this.studentGuardianService.findByGuardianId(guardianId),
      "Guardian students retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a new student guardian relation" })
  async create(@Body(new ZodValidationPipe()) dto: CreateStudentGuardianDto) {
    return ResponseHelper.success(
      await this.studentGuardianService.create(dto),
      "Student guardian relation created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing student guardian relation" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateStudentGuardianDto,
  ) {
    return ResponseHelper.success(
      await this.studentGuardianService.update(id, dto),
      "Student guardian relation updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a student guardian relation" })
  async remove(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.studentGuardianService.remove(id),
      "Student guardian relation deleted successfully",
    );
  }
}
