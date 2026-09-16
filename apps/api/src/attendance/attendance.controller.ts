import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
} from "@repo/shared/schemas/attendance.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { AttendanceService } from "./attendance.service";

@ApiTags("Attendances")
@ApiBearerAuth("JWT-auth")
@Controller("attendances")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({
    summary: "Get all attendance records with pagination, search and filters",
  })
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string,
    @Query("schedule_id") schedule_id?: string,
    @Query("student_id") student_id?: string,
    @Query("attendance_status_id") attendance_status_id?: string,
    @Query("attendance_date") attendance_date?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const result = await this.attendanceService.findAll(
      pageNumber,
      limitNumber,
      {
        search,
        schedule_id,
        student_id,
        attendance_status_id,
        attendance_date,
      },
    );
    return ResponseHelper.success(
      result.data,
      "Attendances retrieved successfully",
      200,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an attendance record by ID" })
  async findOne(@Param("id") id: string) {
    const attendance = await this.attendanceService.findOne(id);
    return ResponseHelper.success(
      attendance,
      "Attendance detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create an attendance record" })
  async create(@Body(new ZodValidationPipe()) dto: CreateAttendanceDto) {
    const attendance = await this.attendanceService.create(dto);
    return ResponseHelper.success(
      attendance,
      "Attendance created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an attendance record" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateAttendanceDto,
  ) {
    const attendance = await this.attendanceService.update(id, dto);
    return ResponseHelper.success(
      attendance,
      "Attendance updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete an attendance record" })
  async remove(@Param("id") id: string) {
    const result = await this.attendanceService.remove(id);
    return ResponseHelper.success(result, "Attendance deleted successfully");
  }
}
