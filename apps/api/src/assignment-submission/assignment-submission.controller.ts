import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateAssignmentSubmissionDto,
  UpdateAssignmentSubmissionDto,
} from "@repo/shared/schemas/assignment-submission.schema";
import { AssignmentSubmissionService } from "./assignment-submission.service";

@ApiTags("Assignment Submissions")
@Controller("assignment-submissions")
export class AssignmentSubmissionController {
  constructor(
    private readonly assignmentSubmissionService: AssignmentSubmissionService,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Get all assignment submissions with pagination and search",
  })
  async findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const result = await this.assignmentSubmissionService.findAll({
      page: pageNumber,
      limit: limitNumber,
      ...(search ? { search } : {}),
    });
    return ResponseHelper.success(
      result,
      "Success fetch assignment submissions",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get assignment submission by ID" })
  async findOne(@Param("id") id: string) {
    const result = await this.assignmentSubmissionService.findById(id);
    return ResponseHelper.success(
      result,
      "Success fetch assignment submission",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create new assignment submission" })
  async create(@Body() body: CreateAssignmentSubmissionDto) {
    const result = await this.assignmentSubmissionService.create(body);
    return ResponseHelper.success(
      result,
      "Success create assignment submission",
    );
  }

  @Put(":id")
  @ApiOperation({ summary: "Update assignment submission" })
  async update(
    @Param("id") id: string,
    @Body() body: UpdateAssignmentSubmissionDto,
  ) {
    const result = await this.assignmentSubmissionService.update(id, body);
    return ResponseHelper.success(
      result,
      "Success update assignment submission",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete assignment submission" })
  async remove(@Param("id") id: string) {
    const result = await this.assignmentSubmissionService.delete(id);
    return ResponseHelper.success(
      result,
      "Success delete assignment submission",
    );
  }
}
