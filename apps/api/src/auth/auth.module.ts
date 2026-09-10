import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET must be configured");
}

@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? "15m") as "15m" | "1d",
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
