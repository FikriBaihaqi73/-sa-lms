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
  CreateProfileDto,
  UpdateProfileDto,
} from "@repo/shared/schemas/profile.schema";
import { ProfileService } from "./profile.service";

@ApiTags("Profiles")
@ApiBearerAuth("JWT-auth")
@Controller("profiles")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: "Get all profiles" })
  async findAll() {
    const profiles = await this.profileService.findAll();
    return ResponseHelper.success(profiles, "Profiles retrieved successfully");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get profile by ID" })
  async findOne(@Param("id") id: string) {
    const profile = await this.profileService.findOne(id);
    return ResponseHelper.success(
      profile,
      "Profile detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a new profile" })
  async create(@Body() createProfileDto: CreateProfileDto) {
    const profile = await this.profileService.create(createProfileDto);
    return ResponseHelper.success(profile, "Profile created successfully", 201);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing profile" })
  async update(
    @Param("id") id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.profileService.update(id, updateProfileDto);
    return ResponseHelper.success(profile, "Profile updated successfully");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a profile" })
  async remove(@Param("id") id: string) {
    const result = await this.profileService.remove(id);
    return ResponseHelper.success(result, "Profile deleted successfully");
  }
}
