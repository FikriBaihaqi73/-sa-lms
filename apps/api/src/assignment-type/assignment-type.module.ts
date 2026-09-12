import { Module } from "@nestjs/common";
import { AssignmentTypeController } from "./assignment-type.controller";
import { AssignmentTypeService } from "./assignment-type.service";

@Module({
  controllers: [AssignmentTypeController],
  providers: [AssignmentTypeService],
  exports: [AssignmentTypeService],
})
export class AssignmentTypeModule {}
