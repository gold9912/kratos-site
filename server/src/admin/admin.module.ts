import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ServicesModule } from "../services/services.module";
import { AdminController } from "./admin.controller";
import { AdminGuard } from "./admin.guard";

@Module({
  imports: [AuthModule, ServicesModule],
  controllers: [AdminController],
  providers: [AdminGuard]
})
export class AdminModule {}
