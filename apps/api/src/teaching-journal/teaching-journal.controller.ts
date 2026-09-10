import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import {
  CreateTeachingJournalDto,
  UpdateTeachingJournalDto,
} from "@repo/shared/schemas/teaching-journal.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { TeachingJournalService } from "./teaching-journal.service";

@ApiTags("Teaching Journals")
@ApiBearerAuth("JWT-auth")
@Controller("teaching-journals")
export class TeachingJournalController {
  constructor(
    private readonly teachingJournalService: TeachingJournalService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all teaching journals" })
  async findAll() {
    const journals = await this.teachingJournalService.findAll();
    return ResponseHelper.success(
      journals,
      "Teaching journals retrieved successfully",
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a teaching journal by ID" })
  async findOne(@Param("id") id: string) {
    const journal = await this.teachingJournalService.findOne(id);
    return ResponseHelper.success(
      journal,
      "Teaching journal detail retrieved successfully",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a teaching journal" })
  async create(@Body(new ZodValidationPipe()) dto: CreateTeachingJournalDto) {
    const journal = await this.teachingJournalService.create(dto);
    return ResponseHelper.success(
      journal,
      "Teaching journal created successfully",
      201,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a teaching journal" })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe()) dto: UpdateTeachingJournalDto,
  ) {
    const journal = await this.teachingJournalService.update(id, dto);
    return ResponseHelper.success(
      journal,
      "Teaching journal updated successfully",
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft-delete a teaching journal" })
  async remove(@Param("id") id: string) {
    const result = await this.teachingJournalService.remove(id);
    return ResponseHelper.success(
      result,
      "Teaching journal deleted successfully",
    );
  }
}
