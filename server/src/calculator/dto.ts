import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsString, Min, ValidateNested } from "class-validator";

export class EstimateItemDto {
  @IsString()
  serviceId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class EstimateDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EstimateItemDto)
  items!: EstimateItemDto[];
}
