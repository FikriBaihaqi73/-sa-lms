import { PrismaClient } from "#generated/client";
import {
  assignmentSubmissionSelect,
} from "#selects/assignment-submission.select";

export class AssignmentSubmissionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.assignmentSubmission.findMany({
      where: {
        deletedAt: null,
      },
      select: assignmentSubmissionSelect,
    });
  }

  async findById(id: string) {
    return this.prisma.assignmentSubmission.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: assignmentSubmissionSelect,
    });
  }
}