import { Module } from "@nestjs/common";
import { AcademicStatusModule } from "./academic-status/academic-status.module";
import { AcademicYearModule } from "./academic-year/academic-year.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AssignmentTypesModule } from "./assignment-types/assignment-types.module";
import { AuthModule } from "./auth/auth.module";
import { InstitutionLevelModule } from "./institution-level/institution-level.module";
import { PermissionModule } from "./permission/permission.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RoleModule } from "./role/role.module";
import { RolePermissionModule } from "./role-permission/role-permission.module";

@Module({
  imports: [
    PrismaModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    InstitutionLevelModule,
    AcademicYearModule,
    AcademicStatusModule,
    AssignmentTypesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
