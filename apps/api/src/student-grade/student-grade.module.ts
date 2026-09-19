import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { StudentGradeController } from "./student-grade.controller";
import { StudentGradeService } from "./student-grade.service";

@Module({
  imports: [PrismaModule],
  controllers: [StudentGradeController],
  providers: [StudentGradeService],
  exports: [StudentGradeService],
})
export class StudentGradeModule {}
