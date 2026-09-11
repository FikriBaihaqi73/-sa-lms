import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseHelper } from "@repo/shared/http/response";
import { LoginDto, RegisterDto } from "@repo/shared/schemas/auth.schema";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorator";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new account with the default registration role",
  })
  async register(@Body(new ZodValidationPipe()) dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return ResponseHelper.success(
      user,
      "Registration successful",
      HttpStatus.CREATED,
    );
  }

  @Post("login")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Authenticate with username and password" })
  async login(@Body(new ZodValidationPipe()) dto: LoginDto) {
    const result = await this.authService.login(dto);
    return ResponseHelper.success(result, "Login successful");
  }
}
