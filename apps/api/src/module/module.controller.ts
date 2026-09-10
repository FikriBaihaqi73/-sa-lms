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
  CreateModuleDto,
  UpdateModuleDto,
} from "@repo/shared/schemas/module.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { LearningModuleService } from "./module.service";

@ApiTags("Learning Modules")
@ApiBearerAuth("JWT-auth")
@Controller("modules")
export class LearningModuleController {
  constructor(private readonly learningModuleService: LearningModuleService) {}

  @Get()
  @ApiOperation({ summary: "Get all learning modules" })
  async findAll() {
    return ResponseHelper.success(
      await this.learningModuleService.findAll(),
      "Learning modules retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a learning module by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.learningModuleService.findOne(id),
      "Learning module detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a learning module" })
  async create(@Body(new ZodValidationPipe()) dto: CreateModuleDto) {
    return ResponseHelper.success(
      await this.learningModuleService.create(dto),
      "Learning module created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a learning module" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateModuleDto,
  ) {
    return ResponseHelper.success(
      await this.learningModuleService.update(id, dto),
      "Learning module updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete a learning module" })
  async remove(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.learningModuleService.remove(id),
      "Learning module deleted successfully",
    );
  }
}
