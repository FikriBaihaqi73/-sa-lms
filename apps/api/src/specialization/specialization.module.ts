import { Module } from "@nestjs/common";
import { SpecializationController } from "./specialization.controller";
import { SpecializationService } from "./specialization.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [SpecializationController],
  providers: [SpecializationService],
  exports: [SpecializationService],
})
export class SpecializationModule {}
