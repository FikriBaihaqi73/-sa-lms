import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { StudentGuardianController } from "./student-guardian.controller";
import { StudentGuardianService } from "./student-guardian.service";

@Module({
  imports: [PrismaModule],
  controllers: [StudentGuardianController],
  providers: [StudentGuardianService],
  exports: [StudentGuardianService],
})
export class StudentGuardianModule {}
