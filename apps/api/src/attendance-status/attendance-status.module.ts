import { Module } from "@nestjs/common";
import { AttendanceStatusController } from "./attendance-status.controller";
import { AttendanceStatusService } from "./attendance-status.service";

@Module({
  controllers: [AttendanceStatusController],
  providers: [AttendanceStatusService],
  exports: [AttendanceStatusService],
})
export class AttendanceStatusModule {}
