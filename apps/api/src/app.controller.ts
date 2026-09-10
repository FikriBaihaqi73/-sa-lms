import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { Public } from "./auth/public.decorator";

@ApiTags("Health Check")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "API Health Check" })
  getHello(): string {
    return this.appService.getHello();
  }
}
