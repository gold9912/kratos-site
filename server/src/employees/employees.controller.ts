import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EmployeesService } from "./employees.service";

@ApiTags("employees")
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employees: EmployeesService) {}

  @Get()
  findAll() {
    return this.employees.findAll();
  }
}
