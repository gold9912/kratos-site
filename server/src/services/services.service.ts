import { Injectable } from "@nestjs/common";
import { CALCULATOR_ITEMS_SEED, SERVICES_SEED } from "../database/seeds";
import { SupabaseService } from "../database/supabase.service";
import type { CalculatorItemDto, ServiceDto } from "./service.dto";

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
      .not("category", "like", "calculator:%")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return (data ?? []) as ServiceDto[];
  }

  async findById(serviceId: string) {
    const services = await this.findAll();
    return services.find((service) => service.id === serviceId) ?? null;
  }

  async findCalculatorItems({ includeInactive = false } = {}): Promise<CalculatorItemDto[]> {
    if (!this.supabase.configured) {
      return CALCULATOR_ITEMS_SEED.filter((item) => includeInactive || item.isActive);
    }

    let query = this.supabase
      .admin()
      .from("services")
      .select("id, title, price, unit, category, is_active, sort_order")
      .like("category", "calculator:%")
      .order("sort_order", { ascending: true });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      price: Number(item.price),
      unit: item.unit,
      category: String(item.category).replace(/^calculator:/, ""),
      isActive: item.is_active,
      sortOrder: item.sort_order
    }));
  }

  async updateCalculatorItem(itemId: string, updates: Partial<CalculatorItemDto>) {
    if (!this.supabase.configured) {
      const item = CALCULATOR_ITEMS_SEED.find((candidate) => candidate.id === itemId);
      if (!item) return null;
      const localUpdates: Partial<CalculatorItemDto> = {};
      if (updates.title !== undefined) localUpdates.title = updates.title;
      if (updates.price !== undefined) localUpdates.price = updates.price;
      if (updates.unit !== undefined) localUpdates.unit = updates.unit;
      if (updates.category !== undefined) localUpdates.category = updates.category.replace(/^calculator:/, "");
      if (updates.isActive !== undefined) localUpdates.isActive = updates.isActive;
      if (updates.sortOrder !== undefined) localUpdates.sortOrder = updates.sortOrder;
      Object.assign(item, localUpdates);
      return item;
    }

    const payload: Record<string, unknown> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.unit !== undefined) payload.unit = updates.unit;
    if (updates.category !== undefined) payload.category = `calculator:${updates.category.replace(/^calculator:/, "")}`;
    if (updates.isActive !== undefined) payload.is_active = updates.isActive;
    if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;

    const { data, error } = await this.supabase
      .admin()
      .from("services")
      .update(payload)
      .eq("id", itemId)
      .like("category", "calculator:%")
      .select("id, title, price, unit, category, is_active, sort_order")
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      price: Number(data.price),
      unit: data.unit,
      category: String(data.category).replace(/^calculator:/, ""),
      isActive: data.is_active,
      sortOrder: data.sort_order
    };
  }
}
