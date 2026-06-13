import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { SupabaseService } from "../database/supabase.service";
import { ServicesService } from "../services/services.service";
import { CreateOrderDto } from "./dto";
import { MailService } from "./mail.service";

@Injectable()
export class OrdersService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly services: ServicesService,
    private readonly mail: MailService
  ) {}

  async create(dto: CreateOrderDto) {
    const service = await this.services.findById(dto.serviceId);
    if (!service) throw new BadRequestException("Unknown service");

    if (!this.supabase.configured) {
      const mail = await this.mail.notifyOrder(dto, service.title);
      return { id: randomUUID(), mail };
    }

    const { data, error } = await this.supabase
      .admin()
      .from("orders")
      .insert({
        customer_name: dto.customerName,
        phone: dto.phone,
        service_id: dto.serviceId,
        area: dto.area ?? null,
        message: dto.message ?? null,
        status: "new"
      })
      .select("id")
      .single();

    if (error) throw error;

    const mail = await this.mail.notifyOrder(dto, service.title);
    return { id: data.id, mail };
  }
}
