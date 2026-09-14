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
  CreateUserDto,
  UpdateUserDto,
} from "@repo/shared/schemas/user.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { UserService } from "./user.service";

@ApiTags("Users")
@ApiBearerAuth("JWT-auth")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: "Get all users" })
  async findAll() {
    const users = await this.userService.findAll();
    return ResponseHelper.success(users, "Users retrieved successfully");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  async findOne(@Param("id") id: string) {
    const user = await this.userService.findOne(id);
    return ResponseHelper.success(user, "User detail retrieved successfully");
  }

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  async create(@Body(new ZodValidationPipe()) dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return ResponseHelper.success(user, "User created successfully", 201);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing user" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, dto);
    return ResponseHelper.success(user, "User updated successfully");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user" })
  async remove(@Param("id") id: string) {
    const result = await this.userService.remove(id);
    return ResponseHelper.success(result, "User deleted successfully");
  }
}
