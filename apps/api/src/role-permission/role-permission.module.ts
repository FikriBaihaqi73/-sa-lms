import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { RolePermissionController } from "./role-permission.controller";
import { RolePermissionService } from "./role-permission.service";

@Module({
  imports: [AuthModule],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
