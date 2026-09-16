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
  CreateGuardianDto,
  UpdateGuardianDto,
} from "@repo/shared/schemas/guardian.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { GuardianService } from "./guardian.service";

@ApiTags("Guardians")
@ApiBearerAuth("JWT-auth")
@Controller("guardians")
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Get()
  @ApiOperation({ summary: "Get all guardians with pagination and search" })
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const result = await this.guardianService.findAll(pageNumber, limitNumber, {
      search,
    });

    return ResponseHelper.success(
      result.data,
      "Guardians retrieved successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a guardian by ID" })
  async findOne(@Param("id") id: string) {
    const guardian = await this.guardianService.findOne(id);
    return ResponseHelper.success(
      guardian,
      "Guardian detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a guardian" })
  async create(@Body(new ZodValidationPipe()) dto: CreateGuardianDto) {
    const guardian = await this.guardianService.create(dto);
    return ResponseHelper.success(
      guardian,
      "Guardian created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a guardian" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateGuardianDto,
  ) {
    const guardian = await this.guardianService.update(id, dto);
    return ResponseHelper.success(guardian, "Guardian updated successfully");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete a guardian" })
  async remove(@Param("id") id: string) {
    const result = await this.guardianService.remove(id);
    return ResponseHelper.success(result, "Guardian deleted successfully");
  }
}
