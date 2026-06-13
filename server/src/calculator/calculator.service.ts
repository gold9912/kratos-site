import { BadRequestException, Injectable } from "@nestjs/common";
import { ServicesService } from "../services/services.service";
import { EstimateDto } from "./dto";

@Injectable()
export class CalculatorService {
  constructor(private readonly services: ServicesService) {}

  async estimate(dto: EstimateDto) {
    const services = await this.services.findCalculatorItems();
    const byId = new Map(services.map((service) => [service.id, service]));
    let total = 0;

    for (const item of dto.items) {
      const service = byId.get(item.serviceId);
      if (!service) throw new BadRequestException(`Unknown service: ${item.serviceId}`);
      total += service.price * item.quantity;
    }

    return { total };
  }
}
