import { Prisma, PrismaClient } from "#generated/client";
import { assignmentSubmissionSelect } from "#selects/assignment-submission.select";

export class AssignmentSubmissionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.AssignmentSubmissionWhereInput = {
      deletedAt: null,
    };

    if (params?.search) {
      where.OR = [
        { feedback: { contains: params.search, mode: "insensitive" } },
        { status: { contains: params.search, mode: "insensitive" } },
        { student: { profile: { fullName: { contains: params.search, mode: "insensitive" } } } },
        { assignment: { title: { contains: params.search, mode: "insensitive" } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.assignmentSubmission.findMany({
        where,
        select: assignmentSubmissionSelect,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.assignmentSubmission.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  async create(data: Prisma.AssignmentSubmissionUncheckedCreateInput) {
    return this.prisma.assignmentSubmission.create({
      data,
      select: assignmentSubmissionSelect,
    });
  }

  async update(id: string, data: Prisma.AssignmentSubmissionUncheckedUpdateInput) {
    return this.prisma.assignmentSubmission.update({
      where: { id },
      data,
      select: assignmentSubmissionSelect,
    });
  }

  async delete(id: string) {
    return this.prisma.assignmentSubmission.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: assignmentSubmissionSelect,
    });
  }
}
