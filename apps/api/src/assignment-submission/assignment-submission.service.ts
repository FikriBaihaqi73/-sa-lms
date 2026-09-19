import { Injectable, NotFoundException } from "@nestjs/common";
import { AssignmentSubmissionRepository } from "@repo/shared/infrastructure/repository/assignment-submission.repository";
import {
  CreateAssignmentSubmissionDto,
  UpdateAssignmentSubmissionDto,
} from "@repo/shared/schemas/assignment-submission.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AssignmentSubmissionService {
  private readonly repository: AssignmentSubmissionRepository;

  constructor(private readonly prisma: PrismaService) {
    this.repository = new AssignmentSubmissionRepository(this.prisma.client);
  }

  async findAll(params?: { page?: number; limit?: number; search?: string }) {
    return this.repository.findAll(params);
  }

  async findById(id: string) {
    const submission = await this.repository.findById(id);
    if (!submission) {
      throw new NotFoundException("Assignment submission not found");
    }
    return submission;
  }

  async create(data: CreateAssignmentSubmissionDto) {
    return this.repository.create(data as any);
  }

  async update(id: string, data: UpdateAssignmentSubmissionDto) {
    await this.findById(id); // Ensure it exists
    return this.repository.update(id, data as any);
  }

  async delete(id: string) {
    await this.findById(id); // Ensure it exists
    return this.repository.delete(id);
  }
}
