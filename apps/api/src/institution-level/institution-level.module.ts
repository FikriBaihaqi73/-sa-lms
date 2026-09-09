import { Module } from "@nestjs/common";
import { InstitutionLevelController } from "./institution-level.controller";
import { InstitutionLevelService } from "./institution-level.service";

@Module({
  controllers: [InstitutionLevelController],
  providers: [InstitutionLevelService],
  exports: [InstitutionLevelService],
})
export class InstitutionLevelModule {}
