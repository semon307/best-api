import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, index } from '@typegoose/typegoose';

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class HHData {
  @prop()
  count: number;

  @prop()
  juniorSalary: number;

  @prop()
  middleSalary: number;

  @prop()
  seniorSalary: number;
}

export class TopPageAdvantages {
  @prop()
  title: string;

  @prop()
  description: string;
}

export interface TopPageModel extends Base {}

@index({ '$**': 'text' })
export class TopPageModel extends TimeStamps {
  @prop({ enum: TopLevelCategory, type: () => Number })
  firstCategory: TopLevelCategory;

  @prop()
  secondCategory: string;

  @prop()
  title: string;

  @prop()
  category: string;

  @prop({ type: () => HHData })
  hh?: HHData;

  @prop({ type: () => [TopPageAdvantages] })
  advantages: Array<TopPageAdvantages>;

  @prop()
  seoText: string;

  @prop()
  tagsTitle: string;

  @prop({ type: () => [String] })
  tags: Array<string>;
}
