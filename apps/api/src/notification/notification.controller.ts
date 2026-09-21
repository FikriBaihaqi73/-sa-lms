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
  CreateNotificationDto,
  NotificationQueryDto,
  UpdateNotificationDto,
} from "@repo/shared/schemas/notification.schema";
import { NotificationService } from "./notification.service";

@ApiTags("Notifications")
@ApiBearerAuth()
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: "Create a new notification" })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    const result = await this.notificationService.create(createNotificationDto);
    return ResponseHelper.success(
      result,
      "Notification successfully created",
      201,
    );
  }

  @Get()
  @ApiOperation({ summary: "Get paginated notifications with search" })
  async findAll(@Query() query: NotificationQueryDto) {
    const result = await this.notificationService.findAll(query);
    return ResponseHelper.success(
      result,
      "Notifications successfully retrieved",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a notification by ID" })
  async findOne(@Param("id") id: string) {
    const result = await this.notificationService.findOne(id);
    return ResponseHelper.success(
      result,
      "Notification successfully retrieved",
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a notification by ID" })
  async update(
    @Param("id") id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    const result = await this.notificationService.update(
      id,
      updateNotificationDto,
    );
    return ResponseHelper.success(result, "Notification successfully updated");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a notification by ID" })
  async remove(@Param("id") id: string) {
    const result = await this.notificationService.remove(id);
    return ResponseHelper.success(result, "Notification successfully deleted");
  }
}
