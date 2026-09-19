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
  CreateClassroomDto,
  UpdateClassroomDto,
} from "@repo/shared/schemas/classroom.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { ClassroomService } from "./classroom.service";

@ApiTags("Classrooms")
@ApiBearerAuth("JWT-auth")
@Controller("classrooms")
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get()
  @ApiOperation({ summary: "Get all classrooms with pagination and search" })
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const result = await this.classroomService.findAll(
      pageNumber,
      limitNumber,
      {
        search,
      },
    );

    return ResponseHelper.success(
      result.data,
      "Classrooms retrieved successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a classroom by ID" })
  async findOne(@Param("id") id: string) {
    const classroom = await this.classroomService.findOne(id);
    return ResponseHelper.success(
      classroom,
      "Classroom detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a classroom" })
  async create(@Body(new ZodValidationPipe()) dto: CreateClassroomDto) {
    const classroom = await this.classroomService.create(dto);
    return ResponseHelper.success(
      classroom,
      "Classroom created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a classroom" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateClassroomDto,
  ) {
    const classroom = await this.classroomService.update(id, dto);
    return ResponseHelper.success(classroom, "Classroom updated successfully");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete a classroom" })
  async remove(@Param("id") id: string) {
    const result = await this.classroomService.remove(id);
    return ResponseHelper.success(result, "Classroom deleted successfully");
  }
}
