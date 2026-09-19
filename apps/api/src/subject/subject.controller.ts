import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateSubjectDto,
  SubjectQueryDto,
  UpdateSubjectDto,
} from "@repo/shared/schemas/subject.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { SubjectService } from "./subject.service";

@ApiTags("Subjects")
@Controller("subjects")
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @ApiOperation({ summary: "Create a new subject" })
  async create(
    @Body(new ZodValidationPipe()) createSubjectDto: CreateSubjectDto,
  ) {
    const data = await this.subjectService.create(createSubjectDto);
    return ResponseHelper.success({
      message: "Subject created successfully",
      data,
      code: HttpStatus.CREATED,
    });
  }

  @Get()
  @ApiOperation({
    summary: "Get a list of subjects with pagination and search",
  })
  async findAll(@Query(new ZodValidationPipe()) query: SubjectQueryDto) {
    const result = await this.subjectService.findAll(query);
    return ResponseHelper.success({
      message: "Subjects retrieved successfully",
      data: result,
      code: HttpStatus.OK,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a subject by ID" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const data = await this.subjectService.findOne(id);
    return ResponseHelper.success({
      message: "Subject retrieved successfully",
      data,
      code: HttpStatus.OK,
    });
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a subject by ID" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe()) updateSubjectDto: UpdateSubjectDto,
  ) {
    const data = await this.subjectService.update(id, updateSubjectDto);
    return ResponseHelper.success({
      message: "Subject updated successfully",
      data,
      code: HttpStatus.OK,
    });
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a subject by ID" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.subjectService.remove(id);
    return ResponseHelper.success({
      message: "Subject deleted successfully",
      data: null,
      code: HttpStatus.OK,
    });
  }
}
