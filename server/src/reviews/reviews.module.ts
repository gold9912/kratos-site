import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { UploadsModule } from "../uploads/uploads.module";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";

@Module({
  imports: [DatabaseModule, UploadsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
