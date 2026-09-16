import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ClassController } from "./class.controller";
import { ClassService } from "./class.service";

@Module({
  imports: [AuthModule],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
export class ClassModule {}
