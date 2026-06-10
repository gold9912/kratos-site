import { IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateOrderDto {
  @IsString()
  @MaxLength(80)
  customerName!: string;

  @IsString()
  @MaxLength(40)
  phone!: string;

  @IsString()
  serviceId!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  area?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
