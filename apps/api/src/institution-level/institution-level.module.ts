import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { InstitutionLevelController } from "./institution-level.controller";
import { InstitutionLevelService } from "./institution-level.service";

@Module({
  imports: [AuthModule],
  controllers: [InstitutionLevelController],
  providers: [InstitutionLevelService],
  exports: [InstitutionLevelService],
})
export class InstitutionLevelModule {}
