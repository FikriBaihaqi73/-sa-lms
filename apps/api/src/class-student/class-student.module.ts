import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ClassStudentController } from "./class-student.controller";
import { ClassStudentService } from "./class-student.service";

@Module({
  imports: [AuthModule],
  controllers: [ClassStudentController],
  providers: [ClassStudentService],
  exports: [ClassStudentService],
})
export class ClassStudentModule {}
