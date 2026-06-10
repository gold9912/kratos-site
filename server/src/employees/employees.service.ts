import { Injectable } from "@nestjs/common";
import { EMPLOYEES_SEED } from "../database/seeds";
import { SupabaseService } from "../database/supabase.service";
import type { EmployeeDto } from "./employee.dto";

@Injectable()
export class EmployeesService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<EmployeeDto[]> {
    if (!this.supabase.configured) return EMPLOYEES_SEED;

    const { data, error } = await this.supabase
      .admin()
      .from("employees")
      .select("id, name, position, experience, photo_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((employee) => ({
      id: employee.id,
      name: employee.name,
      position: employee.position,
      experience: employee.experience,
      photoUrl: employee.photo_url
    }));
  }
}
