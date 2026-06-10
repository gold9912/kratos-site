import { BadRequestException } from "@nestjs/common";

export function assertNoSupabaseError(error: unknown, fallback = "Supabase request failed") {
  if (!error) return;

  if (typeof error === "object" && error && "message" in error) {
    throw new BadRequestException(String((error as { message: unknown }).message));
  }

  throw new BadRequestException(fallback);
}
