import { Transform } from "class-transformer";
import { IsInt, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateReviewDto {
  @IsString()
  @MaxLength(1500)
  reviewText!: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;
}
