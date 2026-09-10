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
  CreateInstitutionLevelDto,
  UpdateInstitutionLevelDto,
} from "@repo/shared/schemas/institution-level.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { InstitutionLevelService } from "./institution-level.service";

@ApiTags("Institution Levels")
@ApiBearerAuth("JWT-auth")
@Controller("institution-levels")
export class InstitutionLevelController {
  constructor(
    private readonly institutionLevelService: InstitutionLevelService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all institution levels" })
  async findAll() {
    const institutionLevels = await this.institutionLevelService.findAll();
    return ResponseHelper.success(
      institutionLevels,
      "Institution levels retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get institution level by ID" })
  async findOne(@Param("id") id: string) {
    const institutionLevel = await this.institutionLevelService.findOne(id);
    return ResponseHelper.success(
      institutionLevel,
      "Institution level detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a new institution level" })
  async create(@Body(new ZodValidationPipe()) dto: CreateInstitutionLevelDto) {
    const institutionLevel = await this.institutionLevelService.create(dto);
    return ResponseHelper.success(
      institutionLevel,
      "Institution level created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing institution level" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateInstitutionLevelDto,
  ) {
    const institutionLevel = await this.institutionLevelService.update(id, dto);
    return ResponseHelper.success(
      institutionLevel,
      "Institution level updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an institution level" })
  async remove(@Param("id") id: string) {
    const result = await this.institutionLevelService.remove(id);
    return ResponseHelper.success(
      result,
      "Institution level deleted successfully",
    );
  }
}
