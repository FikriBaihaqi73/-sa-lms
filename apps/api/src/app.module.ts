import { Module } from "@nestjs/common";
import { AcademicStatusModule } from "./academic-status/academic-status.module";
import { AcademicYearModule } from "./academic-year/academic-year.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AttendanceModule } from "./attendance/attendance.module";
import { AuthModule } from "./auth/auth.module";
import { InstitutionLevelModule } from "./institution-level/institution-level.module";
import { LearningModuleModule } from "./module/module.module";
import { ModuleContentModule } from "./module-content/module-content.module";
import { PermissionModule } from "./permission/permission.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RoleModule } from "./role/role.module";
import { RolePermissionModule } from "./role-permission/role-permission.module";
import { StudyPlanModule } from "./study-plan/study-plan.module";
import { TeachingJournalModule } from "./teaching-journal/teaching-journal.module";

@Module({
  imports: [
    PrismaModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    InstitutionLevelModule,
    AcademicYearModule,
    AcademicStatusModule,
    AuthModule,
    AttendanceModule,
    StudyPlanModule,
    LearningModuleModule,
    ModuleContentModule,
    TeachingJournalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
