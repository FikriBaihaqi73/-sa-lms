import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AcademicStatusModule } from "./academic-status/academic-status.module";
import { AcademicYearModule } from "./academic-year/academic-year.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AssignmentTypeModule } from "./assignment-type/assignment-type.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { AttendanceStatusModule } from "./attendance-status/attendance-status.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { ClassModule } from "./class/class.module";
import { ClassSubjectModule } from "./class-subject/class-subject.module";
import { DepartmentsModule } from "./departments/departments.module";
import { EmploymentStatusModule } from "./employment-status/employment-status.module";
import { GuardianModule } from "./guardian/guardian.module";
import { InstitutionModule } from "./institution/institution.module";
import { InstitutionLevelModule } from "./institution-level/institution-level.module";
import { LearningModuleModule } from "./module/module.module";
import { ModuleContentModule } from "./module-content/module-content.module";
import { NationalityModule } from "./nationality/nationality.module";
import { PermissionModule } from "./permission/permission.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProfileModule } from "./profile/profile.module";
import { ReligionModule } from "./religion/religion.module";
import { RoleModule } from "./role/role.module";
import { RolePermissionModule } from "./role-permission/role-permission.module";
import { SpecializationModule } from "./specialization/specialization.module";
import { StudentModule } from "./student/student.module";
import { StudentGuardianModule } from "./student-guardian/student-guardian.module";
import { StudyPlanModule } from "./study-plan/study-plan.module";
import { TeachersModule } from "./teachers/teachers.module";
import { TeachingJournalModule } from "./teaching-journal/teaching-journal.module";
import { UserModule } from "./user/user.module";
import { SubjectModule } from "./subject/subject.module";

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
    GuardianModule,
    AttendanceStatusModule,
    SpecializationModule,
    AttendanceModule,
    StudyPlanModule,
    LearningModuleModule,
    ModuleContentModule,
    TeachingJournalModule,
    NationalityModule,
    ReligionModule,
    ProfileModule,
    AssignmentTypeModule,
    DepartmentsModule,
    TeachersModule,
    UserModule,
    StudentGuardianModule,
    StudentModule,
    ClassModule,
    SubjectModule,
    ClassSubjectModule,
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
