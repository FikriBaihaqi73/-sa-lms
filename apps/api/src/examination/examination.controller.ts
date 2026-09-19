import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateExaminationDto,
  UpdateExaminationDto,
} from "@repo/shared/schemas/examination.schema";
import { ExaminationService } from "./examination.service";

@ApiTags("Examinations")
@Controller("examinations")
export class ExaminationController {
  constructor(private readonly service: ExaminationService) {}

  @Post()
  @ApiOperation({ summary: "Create a new examination" })
  async create(
    @Req() req: any,
    @Body() data: CreateExaminationDto,
  ) {
    // If the authentication guard is used, req.user might be available.
    // Ensure createdBy is set correctly.
    if (req.user?.id) {
      data.createdBy = req.user.id;
    }
    const result = await this.service.create(data);
    return ResponseHelper.success(
      result,
      "Examination created successfully",
      201,
    );
  }

  @Get()
  @ApiOperation({ summary: "Get all examinations with pagination and search" })
  async findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    
    const result = await this.service.findAll(pageNum, limitNum, search);
    return ResponseHelper.success(
      result,
      "Examinations retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific examination by ID" })
  async findById(@Param("id") id: string) {
    const result = await this.service.findById(id);
    return ResponseHelper.success(
      result,
      "Examination retrieved successfully",
    );
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an examination by ID" })
  async update(
    @Req() req: any,
    @Param("id") id: string,
    @Body() data: UpdateExaminationDto,
  ) {
    if (req.user?.id) {
      data.updatedBy = req.user.id;
    }
    const result = await this.service.update(id, data);
    return ResponseHelper.success(
      result,
      "Examination updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete an examination by ID" })
  async delete(@Param("id") id: string) {
    const result = await this.service.softDelete(id);
    return ResponseHelper.success(
      result,
      "Examination deleted successfully",
    );
  }
}
