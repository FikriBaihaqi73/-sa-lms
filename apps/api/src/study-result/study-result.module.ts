import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { StudyResultController } from "./study-result.controller";
import { StudyResultService } from "./study-result.service";

@Module({
  imports: [PrismaModule],
  controllers: [StudyResultController],
  providers: [StudyResultService],
  exports: [StudyResultService],
})
export class StudyResultModule {}
