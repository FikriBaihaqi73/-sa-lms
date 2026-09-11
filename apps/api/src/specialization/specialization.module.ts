import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { SpecializationController } from "./specialization.controller";
import { SpecializationService } from "./specialization.service";

@Module({
  imports: [AuthModule],
  controllers: [SpecializationController],
  providers: [SpecializationService],
  exports: [SpecializationService],
})
export class SpecializationModule {}
