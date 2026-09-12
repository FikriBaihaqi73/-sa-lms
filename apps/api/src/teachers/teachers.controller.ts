import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  CreateTeacherDto,
  UpdateTeacherDto,
} from "@repo/shared/schemas/teacher.schema";
import { TeachersService } from "./teachers.service";

@ApiTags("Teachers")
@Controller("teachers")
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new teacher" })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @ApiOperation({ summary: "Retrieve all teachers" })
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve a teacher by ID" })
  findById(@Param("id") id: string) {
    return this.teachersService.findById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a teacher" })
  update(@Param("id") id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a teacher" })
  delete(@Param("id") id: string) {
    return this.teachersService.delete(id);
  }
}
