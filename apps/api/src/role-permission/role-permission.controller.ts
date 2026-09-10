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
  CreateRolePermissionDto,
  UpdateRolePermissionDto,
} from "@repo/shared/schemas/role-permission.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { RolePermissionService } from "./role-permission.service";

@ApiTags("Role Permissions")
@ApiBearerAuth("JWT-auth")
@Controller("role-permissions")
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Get()
  @ApiOperation({ summary: "Get all role permission assignments" })
  async findAll() {
    const rolePermissions = await this.rolePermissionService.findAll();
    return ResponseHelper.success(
      rolePermissions,
      "Role permissions retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a role permission assignment by ID" })
  async findOne(@Param("id") id: string) {
    const rolePermission = await this.rolePermissionService.findOne(id);
    return ResponseHelper.success(
      rolePermission,
      "Role permission detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a role permission assignment" })
  async create(@Body(new ZodValidationPipe()) dto: CreateRolePermissionDto) {
    const rolePermission = await this.rolePermissionService.create(dto);
    return ResponseHelper.success(
      rolePermission,
      "Role permission created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a role permission assignment" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateRolePermissionDto,
  ) {
    const rolePermission = await this.rolePermissionService.update(id, dto);
    return ResponseHelper.success(
      rolePermission,
      "Role permission updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a role permission assignment" })
  async remove(@Param("id") id: string) {
    const result = await this.rolePermissionService.remove(id);
    return ResponseHelper.success(
      result,
      "Role permission deleted successfully",
    );
  }
}
