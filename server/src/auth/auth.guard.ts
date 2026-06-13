import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import type { AuthenticatedRequest } from "./authenticated-request";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest & Request>();
    const token = this.getToken(request);

    if (!token) {
      throw new UnauthorizedException("Authentication is required");
    }

    const user = await this.auth.validateAccessToken(token);

    if (!user) {
      throw new UnauthorizedException("Invalid session");
    }

    request.user = { id: user.id, email: user.email };
    return true;
  }

  private getToken(request: Request) {
    const cookies = request.cookies as Record<string, string | undefined> | undefined;
    const header = request.headers.authorization;

    if (cookies?.["kratos-access-token"]) return cookies["kratos-access-token"];
    if (header?.startsWith("Bearer ")) return header.slice("Bearer ".length);
    return undefined;
  }
}
