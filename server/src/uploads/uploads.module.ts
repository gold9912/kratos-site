import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { UploadsService } from "./uploads.service";

@Module({
  imports: [DatabaseModule],
  providers: [UploadsService],
  exports: [UploadsService]
})
export class UploadsModule {}
