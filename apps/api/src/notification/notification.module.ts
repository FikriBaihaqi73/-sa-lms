import { Module } from "@nestjs/common";
import { NotificationRepository } from "@repo/shared/infrastructure/repository/notification.repository";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
