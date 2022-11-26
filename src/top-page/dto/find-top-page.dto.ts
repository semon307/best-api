import { TopLevelCategory } from '../top-page.model/top-page.model';
import { IsEnum } from 'class-validator';

export class FindTopPageDto {
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;
}
