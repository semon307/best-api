import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductCharacteristicsDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CreateProductDto {
  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  oldPrice?: number;

  @IsNumber()
  credit: number;

  @IsNumber()
  calculatedRating: number;

  @IsString()
  description: string;

  @IsString()
  advantages: string;

  @IsString()
  disadvantages: string;

  @IsArray()
  @IsString({ each: true })
  categories: Array<string>;

  @IsString()
  tags: string;

  @IsArray()
  @ValidateNested()
  @Type(() => ProductCharacteristicsDto)
  characteristics: Array<ProductCharacteristicsDto>;
}
