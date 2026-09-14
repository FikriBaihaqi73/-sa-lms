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
import {
  CreateStudentDto,
  UpdateStudentDto,
} from "@repo/shared/schemas/student.schema";

@Controller("students")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  findAll(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
    @Query("search") search?: string,
  ) {
    return this.studentService.findAll(page, limit, search);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.studentService.findById(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.studentService.delete(id);
  }
}