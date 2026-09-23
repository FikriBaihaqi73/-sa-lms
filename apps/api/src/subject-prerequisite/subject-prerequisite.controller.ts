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
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateSubjectPrerequisiteDto,
  SubjectPrerequisiteQueryDto,
  UpdateSubjectPrerequisiteDto,
} from "@repo/shared/schemas/subject-prerequisite.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { SubjectPrerequisiteService } from "./subject-prerequisite.service";

@ApiTags("Subject Prerequisites")
@ApiBearerAuth("JWT-auth")
@Controller("subject-prerequisites")
export class SubjectPrerequisiteController {
  constructor(
    private readonly subjectPrerequisiteService: SubjectPrerequisiteService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a subject prerequisite relation" })
  async create(
    @Body(new ZodValidationPipe()) dto: CreateSubjectPrerequisiteDto,
  ) {
    const data = await this.subjectPrerequisiteService.create(dto);
    return ResponseHelper.success(
      data,
      "Subject prerequisite created successfully",
      HttpStatus.CREATED,
    );
  }

  @Get()
  @ApiOperation({
    summary: "Get subject prerequisites with pagination and search",
  })
  async findAll(
    @Query(new ZodValidationPipe()) query: SubjectPrerequisiteQueryDto,
  ) {
    const result = await this.subjectPrerequisiteService.findAll(query);
    return ResponseHelper.success(
      result.data,
      "Subject prerequisites retrieved successfully",
      HttpStatus.OK,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a subject prerequisite relation by ID" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const data = await this.subjectPrerequisiteService.findOne(id);
    return ResponseHelper.success(
      data,
      "Subject prerequisite retrieved successfully",
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a subject prerequisite relation" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe()) dto: UpdateSubjectPrerequisiteDto,
  ) {
    const data = await this.subjectPrerequisiteService.update(id, dto);
    return ResponseHelper.success(
      data,
      "Subject prerequisite updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a subject prerequisite relation" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    const data = await this.subjectPrerequisiteService.remove(id);
    return ResponseHelper.success(
      data,
      "Subject prerequisite deleted successfully",
    );
  }
}
