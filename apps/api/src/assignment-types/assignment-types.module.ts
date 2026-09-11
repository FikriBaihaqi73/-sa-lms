import { Module } from "@nestjs/common";
import { AssignmentTypesController } from "./assignment-types.controller";
import { AssignmentTypesService } from "./assignment-types.service";

@Module({
  controllers: [AssignmentTypesController],
  providers: [AssignmentTypesService],
  exports: [AssignmentTypesService],
})
export class AssignmentTypesModule {}
