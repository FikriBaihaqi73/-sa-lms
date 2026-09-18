import { Module } from "@nestjs/common";
import { AssignmentSubmissionController } from "./assignment-submission.controller";
import { AssignmentSubmissionService } from "./assignment-submission.service";

@Module({
  controllers: [AssignmentSubmissionController],
  providers: [AssignmentSubmissionService],
  exports: [AssignmentSubmissionService],
})
export class AssignmentSubmissionModule {}
