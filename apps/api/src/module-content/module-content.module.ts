import { Module } from "@nestjs/common";
import { ModuleContentController } from "./module-content.controller";
import { ModuleContentService } from "./module-content.service";

@Module({
  controllers: [ModuleContentController],
  providers: [ModuleContentService],
  exports: [ModuleContentService],
})
export class ModuleContentModule {}
