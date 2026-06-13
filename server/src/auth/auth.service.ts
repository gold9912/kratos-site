import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalAuthStore } from "../database/local-auth-store.service";
import { SupabaseService } from "../database/supabase.service";
import { assertNoSupabaseError } from "../common/to-api-error";

export interface SessionTokens {
  accessToken?: string;
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly localAuth: LocalAuthStore,
    private readonly config: ConfigService
  ) {}

  async register(email: string, password: string, username: string) {
    if (!this.supabase.configured) {
      return this.withAdminFlag(this.localAuth.register(email, password, username));
    }

    const created = await this.supabase.admin().auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username }
    });
    assertNoSupabaseError(created.error);

    if (!created.data.user) {
      throw new BadRequestException("Registration failed");
    }

    await this.supabase.admin().from("profiles").upsert({
      id: created.data.user.id,
      username,
      avatar_url: null
    });

    const login = await this.supabase.anon().auth.signInWithPassword({ email, password });
    assertNoSupabaseError(login.error);

    if (!login.data.user || !login.data.session) {
      throw new BadRequestException("Registration succeeded, but login session was not created");
    }

    return {
      user: {
        id: login.data.user.id,
        email: login.data.user.email ?? email,
        username,
        avatarUrl: null,
        isAdmin: this.isAdmin(login.data.user.email ?? email)
      },
      tokens: {
        accessToken: login.data.session.access_token,
        refreshToken: login.data.session.refresh_token
      } satisfies SessionTokens
    };
  }

  async login(email: string, password: string) {
    if (!this.supabase.configured) {
      return this.withAdminFlag(this.localAuth.login(email, password));
    }

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
        avatarUrl: profile?.avatar_url ?? null,
        isAdmin: this.isAdmin(data.user.email ?? email)
      },
      tokens: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token
      } satisfies SessionTokens
    };
  }

  async userFromAccessToken(accessToken?: string) {
    if (!accessToken) return null;

    if (!this.supabase.configured) {
      const user = this.localAuth.findByToken(accessToken);
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        isAdmin: this.isAdmin(user.email)
      };
    }

    const { data, error } = await this.supabase.anon().auth.getUser(accessToken);
    if (error || !data.user) return null;

    const profile = await this.findProfile(data.user.id);

    return {
      id: data.user.id,
      email: data.user.email ?? "",
      username: profile?.username ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      isAdmin: this.isAdmin(data.user.email ?? "")
    };
  }

  isAdmin(email?: string | null) {
    if (!email) return false;
    return this.config
      .get("ADMIN_EMAILS", "admin@example.com")
      .split(",")
      .map((item: string) => item.trim().toLowerCase())
      .filter(Boolean)
      .includes(email.toLowerCase());
  }

  async validateAccessToken(accessToken?: string) {
    return this.userFromAccessToken(accessToken);
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

  private withAdminFlag<T extends { user: { email: string; isAdmin?: boolean } }>(payload: T): T {
    payload.user.isAdmin = this.isAdmin(payload.user.email);
    return payload;
  }
}
