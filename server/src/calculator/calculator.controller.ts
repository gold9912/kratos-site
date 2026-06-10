import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CalculatorService } from "./calculator.service";
import { EstimateDto } from "./dto";

@ApiTags("calculator")
@Controller("calculator")
export class CalculatorController {
  constructor(private readonly calculator: CalculatorService) {}

  @Post("estimate")
  estimate(@Body() dto: EstimateDto) {
    return this.calculator.estimate(dto);
  }
}
