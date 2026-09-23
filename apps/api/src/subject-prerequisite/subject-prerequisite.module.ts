import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SubjectPrerequisiteController } from "./subject-prerequisite.controller";
import { SubjectPrerequisiteService } from "./subject-prerequisite.service";

@Module({
  imports: [PrismaModule],
  controllers: [SubjectPrerequisiteController],
  providers: [SubjectPrerequisiteService],
  exports: [SubjectPrerequisiteService],
})
export class SubjectPrerequisiteModule {}
