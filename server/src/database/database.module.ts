import { Module } from "@nestjs/common";
import { LocalAuthStore } from "./local-auth-store.service";
import { SupabaseService } from "./supabase.service";

@Module({
  providers: [SupabaseService, LocalAuthStore],
  exports: [SupabaseService, LocalAuthStore]
})
export class DatabaseModule {}
