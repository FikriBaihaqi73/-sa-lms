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
import { StudentService } from "./student.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  CreateStudentDto,
  UpdateStudentDto,
} from "@repo/shared/schemas/student.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { StudentService } from "./student.service";

@ApiTags("Students")
@ApiBearerAuth("JWT-auth")
@Controller("students")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({ summary: "Create a student" })
  create(
    @Body(new ZodValidationPipe()) createStudentDto: CreateStudentDto,
  ) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: "Get students with search and pagination" })
  findAll(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
    @Query("search") search?: string,
  ) {
    return this.studentService.findAll(page, limit, search);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get student by ID" })
  findById(@Param("id") id: string) {
    return this.studentService.findById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a student" })
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) updateStudentDto: UpdateStudentDto,
  ) {
  update(@Param("id") id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a student" })
  delete(@Param("id") id: string) {
    return this.studentService.delete(id);
  }
}
