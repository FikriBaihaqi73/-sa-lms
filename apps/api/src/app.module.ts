import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AcademicStatusModule } from "./academic-status/academic-status.module";
import { AcademicYearModule } from "./academic-year/academic-year.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { EmploymentStatusModule } from "./employment-status/employment-status.module";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { InstitutionLevelModule } from "./institution-level/institution-level.module";
import { PermissionModule } from "./permission/permission.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RoleModule } from "./role/role.module";
import { RolePermissionModule } from "./role-permission/role-permission.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    InstitutionLevelModule,
    AcademicYearModule,
    AcademicStatusModule,
    EmploymentStatusModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
