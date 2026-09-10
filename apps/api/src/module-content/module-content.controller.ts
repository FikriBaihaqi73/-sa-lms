import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateModuleContentDto,
  UpdateModuleContentDto,
} from "@repo/shared/schemas/module-content.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { ModuleContentService } from "./module-content.service";

@ApiTags("Module Contents")
@Controller("module-contents")
export class ModuleContentController {
  constructor(private readonly moduleContentService: ModuleContentService) {}

  @Get()
  @ApiOperation({ summary: "Get all module contents" })
  async findAll() {
    return ResponseHelper.success(
      await this.moduleContentService.findAll(),
      "Module contents retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get module content by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.moduleContentService.findOne(id),
      "Module content detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create module content" })
  async create(@Body(new ZodValidationPipe()) dto: CreateModuleContentDto) {
    return ResponseHelper.success(
      await this.moduleContentService.create(dto),
      "Module content created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update module content" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateModuleContentDto,
  ) {
    return ResponseHelper.success(
      await this.moduleContentService.update(id, dto),
      "Module content updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete module content" })
  async remove(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.moduleContentService.remove(id),
      "Module content deleted successfully",
    );
  }
}
