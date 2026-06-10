import { Injectable } from "@nestjs/common";
import { SERVICES_SEED } from "../database/seeds";
import { SupabaseService } from "../database/supabase.service";
import type { ServiceDto } from "./service.dto";

@Injectable()
export class ServicesService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<ServiceDto[]> {
    if (!this.supabase.configured) return SERVICES_SEED;

    const { data, error } = await this.supabase
      .admin()
      .from("services")
      .select("id, title, description, price, unit, icon, category")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return (data ?? []) as ServiceDto[];
  }

  async findById(serviceId: string) {
    const services = await this.findAll();
    return services.find((service) => service.id === serviceId) ?? null;
  }
}
