import { Module } from "@nestjs/common";
import { EmploymentStatusController } from "./employment-status.controller";
import { EmploymentStatusService } from "./employment-status.service";

@Module({
  controllers: [EmploymentStatusController],
  providers: [EmploymentStatusService],
  exports: [EmploymentStatusService],
})
export class EmploymentStatusModule {}
