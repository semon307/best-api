import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../top-page.model/top-page.model';
import { Type } from 'class-transformer';

class HHDataDto {
  @IsNumber()
  count: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

class TopPageAdvantagesDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateTopPageDto {
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => HHDataDto)
  hh?: HHDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopPageAdvantagesDto)
  advantages: Array<TopPageAdvantagesDto>;

  @IsString()
  seoText: string;

  @IsString()
  tagsTitle: string;

  @IsArray()
  @IsString({ each: true })
  tags: Array<string>;
}

/* const x: CreateTopPageDto = {
  firstCategory: 0,
  secondCategory: '1',
  title: 'Test',
  category: 'category',
  advantages: [{ title: 'test advantage', description: 'stupid description' }],
  seoText: 'seo text',
  tagsTitle: 'text',
  tags: ['text'],
}; */
