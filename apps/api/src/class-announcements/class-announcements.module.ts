import { Module } from "@nestjs/common";
import { ClassAnnouncementsService } from "./class-announcements.service.js";
import { ClassAnnouncementsController } from "./class-announcements.controller.js";

@Module({
  controllers: [ClassAnnouncementsController],
  providers: [ClassAnnouncementsService],
  exports: [ClassAnnouncementsService],
})
export class ClassAnnouncementsModule {}
