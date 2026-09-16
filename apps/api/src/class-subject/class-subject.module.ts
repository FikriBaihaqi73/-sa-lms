import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ClassSubjectController } from "./class-subject.controller";
import { ClassSubjectService } from "./class-subject.service";

@Module({
  imports: [PrismaModule],
  controllers: [ClassSubjectController],
  providers: [ClassSubjectService],
  exports: [ClassSubjectService],
})
export class ClassSubjectModule {}
