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
import { CreateRoleDto, UpdateRoleDto } from "@repo/shared/schemas/role.schema";
import { RoleService } from "./role.service";

@ApiTags("Roles")
@ApiBearerAuth("JWT-auth")
@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: "Get all roles" })
  async findAll() {
    const roles = await this.roleService.findAll();
    return ResponseHelper.success(roles, "Roles retrieved successfully");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get role by ID" })
  async findOne(@Param("id") id: string) {
    const role = await this.roleService.findOne(id);
    return ResponseHelper.success(role, "Role detail retrieved successfully");
  }

  @Post()
  @ApiOperation({ summary: "Create a new role" })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);
    return ResponseHelper.success(role, "Role created successfully", 201);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing role" })
  async update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.roleService.update(id, updateRoleDto);
    return ResponseHelper.success(role, "Role updated successfully");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a role" })
  async remove(@Param("id") id: string) {
    const result = await this.roleService.remove(id);
    return ResponseHelper.success(result, "Role deleted successfully");
  }
}
