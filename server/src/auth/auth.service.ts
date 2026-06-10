import { BadRequestException, Injectable } from "@nestjs/common";
import { SupabaseService } from "../database/supabase.service";
import { assertNoSupabaseError } from "../common/to-api-error";

export interface SessionTokens {
  accessToken?: string;
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async register(email: string, password: string, username: string) {
    const { data, error } = await this.supabase.anon().auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    assertNoSupabaseError(error);

    if (!data.user) {
      throw new BadRequestException("Registration failed");
    }

    await this.supabase.admin().from("profiles").upsert({
      id: data.user.id,
      username,
      avatar_url: null
    });

    return {
      user: {
        id: data.user.id,
        email: data.user.email ?? email,
        username,
        avatarUrl: null
      },
      tokens: {
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token
      } satisfies SessionTokens
    };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.anon().auth.signInWithPassword({ email, password });
    assertNoSupabaseError(error);

    if (!data.user || !data.session) {
      throw new BadRequestException("Login failed");
    }

    const profile = await this.findProfile(data.user.id);

    return {
      user: {
        id: data.user.id,
        email: data.user.email ?? email,
        username: profile?.username ?? null,
        avatarUrl: profile?.avatar_url ?? null
      },
      tokens: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token
      } satisfies SessionTokens
    };
  }

  async userFromAccessToken(accessToken?: string) {
    if (!accessToken) return null;

    const { data, error } = await this.supabase.anon().auth.getUser(accessToken);
    if (error || !data.user) return null;

    const profile = await this.findProfile(data.user.id);

    return {
      id: data.user.id,
      email: data.user.email ?? "",
      username: profile?.username ?? null,
      avatarUrl: profile?.avatar_url ?? null
    };
  }

  private async findProfile(userId: string) {
    const { data } = await this.supabase
      .admin()
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    return data as { username: string | null; avatar_url: string | null } | null;
  }
}
