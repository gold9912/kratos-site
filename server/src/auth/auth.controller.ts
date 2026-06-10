import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { sessionCookieOptions } from "../common/cookie-options";
import { AuthService, SessionTokens } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService
  ) {}

  @Post("register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.register(dto.email, dto.password, dto.username);
    this.setCookies(response, result.tokens);
    return { user: result.user };
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(dto.email, dto.password);
    this.setCookies(response, result.tokens);
    return { user: result.user };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("kratos-access-token", { path: "/" });
    response.clearCookie("kratos-refresh-token", { path: "/" });
    return { ok: true };
  }

  @Get("me")
  async me(@Req() request: Request) {
    const cookies = request.cookies as Record<string, string | undefined> | undefined;
    const user = await this.auth.userFromAccessToken(cookies?.["kratos-access-token"]);
    return { user };
  }

  private setCookies(response: Response, tokens: SessionTokens) {
    if (!tokens.accessToken || !tokens.refreshToken) return;

    const options = sessionCookieOptions(this.config.get("COOKIE_SECURE", "false") === "true");
    response.cookie("kratos-access-token", tokens.accessToken, options);
    response.cookie("kratos-refresh-token", tokens.refreshToken, options);
  }
}
