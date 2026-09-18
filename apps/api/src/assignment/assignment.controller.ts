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
  CreateAssignmentDto,
  UpdateAssignmentDto,
} from "@repo/shared/schemas/assignment.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { AssignmentService } from "./assignment.service";

@ApiTags("Assignments")
@ApiBearerAuth("JWT-auth")
@Controller("assignments")
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  @ApiOperation({
    summary:
      "Get all assignments with class subject and assignment type relations, pagination and search",
  })
  async findAll(
    @Query("page") page = "1",
    @Query("limit") limit = "10",
    @Query("search") search?: string,
  ) {
    const result = await this.assignmentService.findAll(
      Number.parseInt(page, 10) || 1,
      Number.parseInt(limit, 10) || 10,
      search,
    );

    return ResponseHelper.success(
      result.data,
      "Assignments retrieved successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an assignment by ID" })
  async findOne(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.assignmentService.findOne(id),
      "Assignment detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create an assignment" })
  async create(@Body(new ZodValidationPipe()) dto: CreateAssignmentDto) {
    return ResponseHelper.success(
      await this.assignmentService.create(dto),
      "Assignment created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an assignment" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateAssignmentDto,
  ) {
    return ResponseHelper.success(
      await this.assignmentService.update(id, dto),
      "Assignment updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete an assignment" })
  async remove(@Param("id") id: string) {
    return ResponseHelper.success(
      await this.assignmentService.remove(id),
      "Assignment deleted successfully",
    );
  }
}
