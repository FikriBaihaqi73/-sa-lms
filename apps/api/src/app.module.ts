import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AcademicStatusModule } from "./academic-status/academic-status.module";
import { AcademicYearModule } from "./academic-year/academic-year.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AttendanceModule } from "./attendance/attendance.module";
import { AttendanceStatusModule } from "./attendance-status/attendance-status.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { EmploymentStatusModule } from "./employment-status/employment-status.module";
import { InstitutionModule } from "./institution/institution.module";
import { InstitutionLevelModule } from "./institution-level/institution-level.module";
import { LearningModuleModule } from "./module/module.module";
import { ModuleContentModule } from "./module-content/module-content.module";
import { PermissionModule } from "./permission/permission.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ReligionModule } from "./religion/religion.module";
import { RoleModule } from "./role/role.module";
import { RolePermissionModule } from "./role-permission/role-permission.module";
import { SpecializationModule } from "./specialization/specialization.module";
import { StudyPlanModule } from "./study-plan/study-plan.module";
import { TeachingJournalModule } from "./teaching-journal/teaching-journal.module";
import { NationalityModule } from "./nationality/nationality.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    InstitutionLevelModule,
    InstitutionModule,
    AcademicYearModule,
    AcademicStatusModule,
    EmploymentStatusModule,
    AttendanceStatusModule,
    SpecializationModule,
    AttendanceModule,
    StudyPlanModule,
    LearningModuleModule,
    ModuleContentModule,
    TeachingJournalModule,
    NationalityModule,
    ReligionModule,
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
