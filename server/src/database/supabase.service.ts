import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private readonly url?: string;
  private readonly anonKey?: string;
  private readonly serviceRoleKey?: string;
  private anonClient?: SupabaseClient;
  private adminClient?: SupabaseClient;

  constructor(config: ConfigService) {
    this.url = config.get<string>("SUPABASE_URL");
    this.anonKey = config.get<string>("SUPABASE_ANON_KEY");
    this.serviceRoleKey = config.get<string>("SUPABASE_SERVICE_ROLE_KEY");
  }

  get configured() {
    return Boolean(this.url && this.anonKey && this.serviceRoleKey && !this.url.includes("your-project"));
  }

  anon() {
    this.assertConfigured();
    this.anonClient ??= createClient(this.url!, this.anonKey!, {
      auth: { persistSession: false }
    });
    return this.anonClient;
  }

  admin() {
    this.assertConfigured();
    this.adminClient ??= createClient(this.url!, this.serviceRoleKey!, {
      auth: { persistSession: false }
    });
    return this.adminClient;
  }

  assertConfigured() {
    if (!this.configured) {
      throw new ServiceUnavailableException("Supabase environment variables are not configured");
    }
  }
}
