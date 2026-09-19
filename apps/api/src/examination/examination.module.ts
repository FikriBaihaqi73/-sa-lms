import { Module } from "@nestjs/common";
import { ExaminationRepository } from "@repo/shared/infrastructure/repository/examination.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { ExaminationController } from "./examination.controller";
import { ExaminationService } from "./examination.service";

@Module({
  imports: [PrismaModule],
  controllers: [ExaminationController],
  providers: [
    ExaminationService,
    {
      provide: ExaminationRepository,
      useFactory: (prisma: PrismaService) =>
        new ExaminationRepository(prisma.client),
      inject: [PrismaService],
    },
  ],
  exports: [ExaminationService],
})
export class ExaminationModule {}
