import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ExaminationScoreController } from "./examination-score.controller";
import { ExaminationScoreService } from "./examination-score.service";

@Module({
  imports: [AuthModule],
  controllers: [ExaminationScoreController],
  providers: [ExaminationScoreService],
  exports: [ExaminationScoreService],
})
export class ExaminationScoreModule {}
