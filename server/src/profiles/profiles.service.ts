import { Injectable } from "@nestjs/common";
import { LocalAuthStore } from "../database/local-auth-store.service";
import { SupabaseService } from "../database/supabase.service";
import { ProfileDto, UpdateProfileDto } from "./dto";

@Injectable()
export class ProfilesService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly localAuth: LocalAuthStore
  ) {}

  async get(userId: string): Promise<ProfileDto> {
    if (!this.supabase.configured) {
      return this.localAuth.getProfile(userId);
    }

    const { data } = await this.supabase
      .admin()
      .from("profiles")
      .select("username, birth_date, age, gender, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    return this.mapProfile(data);
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<ProfileDto> {
    if (!this.supabase.configured) {
      return this.localAuth.updateProfile(userId, {
        username: dto.username ?? null,
        birthDate: dto.birthDate ?? null,
        age: dto.age ?? null,
        gender: dto.gender ?? null,
        avatarUrl: dto.avatarUrl ?? null
      });
    }

    const { data, error } = await this.supabase
      .admin()
      .from("profiles")
      .upsert({
        id: userId,
        username: dto.username ?? null,
        birth_date: dto.birthDate ?? null,
        age: dto.age ?? null,
        gender: dto.gender ?? null,
        avatar_url: dto.avatarUrl ?? null
      })
      .select("username, birth_date, age, gender, avatar_url")
      .single();

    if (error) throw error;
    return this.mapProfile(data);
  }

  private mapProfile(data: unknown): ProfileDto {
    const profile = data as
      | { username: string | null; birth_date: string | null; age: number | null; gender: string | null; avatar_url: string | null }
      | null;

    return {
      username: profile?.username ?? null,
      birthDate: profile?.birth_date ?? null,
      age: profile?.age ?? null,
      gender: profile?.gender ?? null,
      avatarUrl: profile?.avatar_url ?? null
    };
  }
}
