import { Module } from "@nestjs/common";
import { NationalityController } from "./nationality.controller";
import { NationalityService } from "./nationality.service";

@Module({
  controllers: [NationalityController],
  providers: [NationalityService],
  exports: [NationalityService],
})
export class NationalityModule {}
