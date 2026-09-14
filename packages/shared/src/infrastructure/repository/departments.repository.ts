import type { Prisma, PrismaClient } from "#generated/client";
import {
  type DepartmentEntity,
  departmentSelect,
} from "#selects/departments.select";

export interface CreateDepartmentInput {
  name: string;
  code: string;
}

export interface UpdateDepartmentInput {
  name?: string | undefined;
  code?: string | undefined;
}

export interface DepartmentSearchInput {
  search?: string | undefined;
}

export class DepartmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateDepartmentInput): Promise<DepartmentEntity> {
    return this.prisma.departments.create({
      data: {
        name: data.name,
        code: data.code,
      },
      select: departmentSelect,
    });
  }

  async findById(id: string): Promise<DepartmentEntity | null> {
    return this.prisma.departments.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: departmentSelect,
    });
  }

  async findByName(name: string): Promise<DepartmentEntity | null> {
    return this.prisma.departments.findFirst({
      where: {
        name,
        deleted_at: null,
      },
      select: departmentSelect,
    });
  }

  async findAll(
    page: number,
    limit: number,
    filters?: DepartmentSearchInput,
  ): Promise<{
    data: DepartmentEntity[];
    meta: {
      totalData: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
    };
  }> {
    const skip = (page - 1) * limit;
    const where = {
      deleted_at: null,
      ...(filters?.search
        ? {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          }
        : {}),
    } satisfies Prisma.DepartmentsWhereInput;

    const [data, totalData] = await Promise.all([
      this.prisma.departments.findMany({
        where,
        skip,
        take: limit,
        select: departmentSelect,
        orderBy: {
          created_at: "desc",
        },
      }),
      this.prisma.departments.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return {
      data,
      meta: {
        totalData,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async update(
    id: string,
    data: UpdateDepartmentInput,
  ): Promise<DepartmentEntity> {
    return this.prisma.departments.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.code !== undefined && {
          code: data.code,
        }),
      },
      select: departmentSelect,
    });
  }

  async delete(id: string): Promise<DepartmentEntity> {
    return this.prisma.departments.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: departmentSelect,
    });
  }
}
