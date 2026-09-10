import { Module } from "@nestjs/common";
import { LearningModuleController } from "./module.controller";
import { LearningModuleService } from "./module.service";

@Module({
  controllers: [LearningModuleController],
  providers: [LearningModuleService],
  exports: [LearningModuleService],
})
export class LearningModuleModule {}
