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
  CreateNationalityDto,
  UpdateNationalityDto,
} from "@repo/shared/schemas/nationality.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { NationalityService } from "./nationality.service";

@ApiTags("Nationalities")
@ApiBearerAuth("JWT-auth")
@Controller("nationalities")
export class NationalityController {
  constructor(private readonly nationalityService: NationalityService) {}

  @Get()
  @ApiOperation({ summary: "Get all nationalities" })
  async findAll() {
    const nationalities = await this.nationalityService.findAll();
    return ResponseHelper.success(
      nationalities,
      "Nationalities retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get nationality by ID" })
  async findOne(@Param("id") id: string) {
    const nationality = await this.nationalityService.findOne(id);
    return ResponseHelper.success(
      nationality,
      "Nationality detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a new nationality" })
  async create(
    @Body(new ZodValidationPipe()) createNationalityDto: CreateNationalityDto,
  ) {
    const nationality = await this.nationalityService.create(
      createNationalityDto,
    );
    return ResponseHelper.success(
      nationality,
      "Nationality created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing nationality" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) updateNationalityDto: UpdateNationalityDto,
  ) {
    const nationality = await this.nationalityService.update(
      id,
      updateNationalityDto,
    );
    return ResponseHelper.success(
      nationality,
      "Nationality updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a nationality" })
  async remove(@Param("id") id: string) {
    const result = await this.nationalityService.remove(id);
    return ResponseHelper.success(result, "Nationality deleted successfully");
  }
}
