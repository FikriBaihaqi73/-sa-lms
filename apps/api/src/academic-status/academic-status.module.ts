import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AcademicStatusController } from "./academic-status.controller";
import { AcademicStatusService } from "./academic-status.service";

@Module({
  imports: [AuthModule],
  controllers: [AcademicStatusController],
  providers: [AcademicStatusService],
  exports: [AcademicStatusService],
})
export class AcademicStatusModule {}
