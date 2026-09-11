import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateAssignmentTypeDto,
  UpdateAssignmentTypeDto,
} from "@repo/shared/schemas/assignment-type.schema";
import { AssignmentTypesService } from "./assignment-types.service";

@ApiTags("Assignment Types")
@ApiBearerAuth("JWT-auth")
@Controller("assignment-types")
export class AssignmentTypesController {
  constructor(
    private readonly assignmentTypesService: AssignmentTypesService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new assignment type" })
  async create(@Body() createAssignmentTypeDto: CreateAssignmentTypeDto) {
    const assignmentType = await this.assignmentTypesService.create(
      createAssignmentTypeDto,
    );

    return ResponseHelper.success(
      assignmentType,
      "Assignment type created successfully",
      201,
    );
  }

  @Get()
  @ApiOperation({ summary: "Get all assignment types" })
  async findAll() {
    const assignmentTypes = await this.assignmentTypesService.findAll();

    return ResponseHelper.success(
      assignmentTypes,
      "Assignment types retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an assignment type by ID" })
  async findOne(@Param("id") id: string) {
    const assignmentType = await this.assignmentTypesService.findOne(id);

    return ResponseHelper.success(
      assignmentType,
      "Assignment type retrieved successfully",
    );
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an assignment type by ID" })
  async update(
    @Param("id") id: string,
    @Body() updateAssignmentTypeDto: UpdateAssignmentTypeDto,
  ) {
    const assignmentType = await this.assignmentTypesService.update(
      id,
      updateAssignmentTypeDto,
    );

    return ResponseHelper.success(
      assignmentType,
      "Assignment type updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an assignment type by ID" })
  async remove(@Param("id") id: string) {
    const assignmentType = await this.assignmentTypesService.remove(id);

    return ResponseHelper.success(
      assignmentType,
      "Assignment type deleted successfully",
    );
  }
}
