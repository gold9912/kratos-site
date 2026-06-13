import { IsInt, IsISO8601, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";

export interface ProfileDto {
  username: string | null;
  birthDate: string | null;
  age: number | null;
  gender: string | null;
  avatarUrl: string | null;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  username?: string | null;

  @IsOptional()
  @IsISO8601({ strict: true })
  birthDate?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  gender?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  avatarUrl?: string | null;
}
