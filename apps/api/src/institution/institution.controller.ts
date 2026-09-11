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
  CreateInstitutionDto,
  UpdateInstitutionDto,
} from "@repo/shared/schemas/institution.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { InstitutionService } from "./institution.service";

@ApiTags("Institutions")
@ApiBearerAuth("JWT-auth")
@Controller("institutions")
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get()
  @ApiOperation({ summary: "Get all institutions" })
  async findAll() {
    return ResponseHelper.success(
      await this.institutionService.findAll(),
      "Institutions retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an institution by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.institutionService.findOne(id),
      "Institution detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create an institution" })
  async create(@Body(new ZodValidationPipe()) dto: CreateInstitutionDto) {
    return ResponseHelper.success(
      await this.institutionService.create(dto),
      "Institution created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an institution" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateInstitutionDto,
  ) {
    return ResponseHelper.success(
      await this.institutionService.update(id, dto),
      "Institution updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete an institution" })
  async remove(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.institutionService.remove(id),
      "Institution deleted successfully",
    );
  }
}
