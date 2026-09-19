import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ExaminationController } from "./examination.controller";
import { ExaminationService } from "./examination.service";
import { ExaminationRepository } from "@repo/shared/infrastructure/repository/examination.repository";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  imports: [PrismaModule],
  controllers: [ExaminationController],
  providers: [
    ExaminationService,
    {
      provide: ExaminationRepository,
      useFactory: (prisma: PrismaService) => new ExaminationRepository(prisma.client),
      inject: [PrismaService],
    },
  ],
  exports: [ExaminationService],
})
export class ExaminationModule {}
