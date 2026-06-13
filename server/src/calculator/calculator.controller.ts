import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CalculatorService } from "./calculator.service";
import { EstimateDto } from "./dto";
import { ServicesService } from "../services/services.service";

@ApiTags("calculator")
@Controller("calculator")
export class CalculatorController {
  constructor(
    private readonly calculator: CalculatorService,
    private readonly services: ServicesService
  ) {}

  @Get("items")
  items() {
    return this.services.findCalculatorItems();
  }

  @Post("estimate")
  estimate(@Body() dto: EstimateDto) {
    return this.calculator.estimate(dto);
  }
}
