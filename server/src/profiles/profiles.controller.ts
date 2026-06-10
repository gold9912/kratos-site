import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import type { AuthenticatedRequest } from "../auth/authenticated-request";
import { UpdateProfileDto } from "./dto";
import { ProfilesService } from "./profiles.service";

@ApiTags("profile")
@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller("profile")
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  @Get()
  get(@Req() request: AuthenticatedRequest) {
    return this.profiles.get(request.user.id);
  }

  @Patch()
  update(@Req() request: AuthenticatedRequest, @Body() dto: UpdateProfileDto) {
    return this.profiles.update(request.user.id, dto);
  }
}
