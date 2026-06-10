import { Module } from "@nestjs/common";
import { ServicesModule } from "../services/services.module";
import { CalculatorController } from "./calculator.controller";
import { CalculatorService } from "./calculator.service";

@Module({
  imports: [ServicesModule],
  controllers: [CalculatorController],
  providers: [CalculatorService]
})
export class CalculatorModule {}
