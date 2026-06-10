import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ServicesModule } from "../services/services.module";
import { MailService } from "./mail.service";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [DatabaseModule, ServicesModule],
  controllers: [OrdersController],
  providers: [OrdersService, MailService]
})
export class OrdersModule {}
