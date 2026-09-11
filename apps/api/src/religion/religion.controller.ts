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
  CreateReligionDto,
  UpdateReligionDto,
} from "@repo/shared/schemas/religion.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { ReligionService } from "./religion.service";

@ApiTags("Religions")
@ApiBearerAuth("JWT-auth")
@Controller("religions")
export class ReligionController {
  constructor(private readonly religionService: ReligionService) {}

  @Get()
  @ApiOperation({ summary: "Get all active religions" })
  async findAll() {
    return ResponseHelper.success(
      await this.religionService.findAll(),
      "Religions retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a religion by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.religionService.findOne(id),
      "Religion retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a religion" })
  async create(@Body(new ZodValidationPipe()) dto: CreateReligionDto) {
    return ResponseHelper.success(
      await this.religionService.create(dto),
      "Religion created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a religion" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateReligionDto,
  ) {
    return ResponseHelper.success(
      await this.religionService.update(id, dto),
      "Religion updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete a religion" })
  async remove(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.religionService.remove(id),
      "Religion deleted successfully",
    );
  }
}
