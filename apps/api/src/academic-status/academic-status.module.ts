import { Module } from "@nestjs/common";
import { AcademicStatusController } from "./academic-status.controller";
import { AcademicStatusService } from "./academic-status.service";

@Module({
  controllers: [AcademicStatusController],
  providers: [AcademicStatusService],
  exports: [AcademicStatusService],
})
export class AcademicStatusModule {}
