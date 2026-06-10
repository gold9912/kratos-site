import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ServicesService } from "./services.service";

@ApiTags("services")
@Controller("services")
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get()
  findAll() {
    return this.services.findAll();
  }
}
