import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { ServicesService } from "../services/services.service";
import { AdminGuard } from "./admin.guard";
import { UpdateCalculatorItemDto } from "./dto";

@ApiTags("admin")
@ApiCookieAuth()
@UseGuards(AuthGuard, AdminGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly services: ServicesService) {}

  @Get("calculator-items")
  calculatorItems() {
    return this.services.findCalculatorItems({ includeInactive: true });
  }

  @Patch("calculator-items/:id")
  async updateCalculatorItem(@Param("id") id: string, @Body() dto: UpdateCalculatorItemDto) {
    const item = await this.services.updateCalculatorItem(id, dto);

    if (!item) {
      throw new NotFoundException("Calculator item was not found");
    }

    return item;
  }
}
