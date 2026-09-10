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
  CreateStudyPlanDto,
  UpdateStudyPlanDto,
} from "@repo/shared/schemas/study-plan.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { StudyPlanService } from "./study-plan.service";

@ApiTags("Study Plans")
@Controller("study-plans")
export class StudyPlanController {
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Get()
  @ApiOperation({ summary: "Get all study plans" })
  async findAll() {
    return ResponseHelper.success(
      await this.studyPlanService.findAll(),
      "Study plans retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a study plan by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.studyPlanService.findOne(id),
      "Study plan detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a study plan" })
  async create(@Body(new ZodValidationPipe()) dto: CreateStudyPlanDto) {
    return ResponseHelper.success(
      await this.studyPlanService.create(dto),
      "Study plan created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a study plan" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateStudyPlanDto,
  ) {
    return ResponseHelper.success(
      await this.studyPlanService.update(id, dto),
      "Study plan updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete a study plan" })
  async remove(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.studyPlanService.remove(id),
      "Study plan deleted successfully",
    );
  }
}
