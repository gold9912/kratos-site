import { Body, Controller, Get, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import type { AuthenticatedRequest } from "../auth/authenticated-request";
import { CreateReviewDto } from "./dto";
import { ReviewsService } from "./reviews.service";

@ApiTags("reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get()
  findAll() {
    return this.reviews.findAll();
  }

  @Post()
  @ApiCookieAuth()
  @ApiConsumes("multipart/form-data")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 5 }], { limits: { fileSize: 5 * 1024 * 1024 } }))
  create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateReviewDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    return this.reviews.create(request.user.id, dto, files.images ?? []);
  }
}
