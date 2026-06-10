import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { CalculatorModule } from "./calculator/calculator.module";
import { DatabaseModule } from "./database/database.module";
import { EmployeesModule } from "./employees/employees.module";
import { HealthModule } from "./health/health.module";
import { OrdersModule } from "./orders/orders.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { ServicesModule } from "./services/services.module";
import { UploadsModule } from "./uploads/uploads.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    ProfilesModule,
    ServicesModule,
    EmployeesModule,
    OrdersModule,
    ReviewsModule,
    UploadsModule,
    CalculatorModule
  ]
})
export class AppModule {}
