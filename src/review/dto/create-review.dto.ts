import { IsString, IsNumber, Max, Min } from 'class-validator';
export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Max(5, { message: 'Maximum value is 5' })
  @Min(1, { message: 'Minimum value is 1' })
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}
