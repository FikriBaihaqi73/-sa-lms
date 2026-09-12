import { Module } from "@nestjs/common";
import { GradeController } from "./grades.controller";
import { GradeService } from "./grades.service";

@Module({
  controllers: [GradeController],
  providers: [GradeService],
  exports: [GradeService],
})
export class GradeModule {}
