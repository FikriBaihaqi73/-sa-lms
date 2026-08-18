import type { PrismaClient } from "#generated/client";
import { type PermissionEntity, permissionSelect } from "#selects/permission.select";

export interface CreatePermissionInput {
    name: string;
    module: string;
    description?: string;
}

export interface UpdatePermissionInput {
    name?: string;
    module?: string;
    description?: string;
}

export class PermissionRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: CreatePermissionInput): Promise<PermissionEntity> {
        return this.prisma.permission.create({
            data: {
                name: data.name,
                module: data.module,
                description: data.description??null,
            },
            select: permissionSelect,
        }); 
    } 

    async findById(id: string): Promise<PermissionEntity | null> {
        return this.prisma.permission.findUnique({
            where: { id },
            select: permissionSelect,
        });
    }

    async findByName(name: string): Promise<PermissionEntity | null> {
        return this.prisma.permission.findFirst({
            where: { name, deletedAt: null },
            select: permissionSelect,
        });
    }

    async findByModule(module: string): Promise<PermissionEntity[]> {
        return this.prisma.permission.findMany({
            where: { module, deletedAt: null },
            select: permissionSelect,
        });
    }

    async findAll(): Promise<PermissionEntity[]> {
        return this.prisma.permission.findMany({
            where: { deletedAt: null },
            select: permissionSelect,
        });
    }

    async update(id: string, data: UpdatePermissionInput): Promise<PermissionEntity> {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.module !== undefined) updateData.module = data.module;
        if (data.description !== undefined) updateData.description = data.description??null;

        return this.prisma.permission.update({
            where: { id },
            data: updateData,
            select: permissionSelect,
        });
    }

    async delete(id: string): Promise<PermissionEntity> {
        return this.prisma.permission.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: permissionSelect,
        });
    }
}