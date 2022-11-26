import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

class ProductCharacteristics {
  @prop()
  name: string;

  @prop()
  value: string;
}

export interface ProductModel extends Base {}

export class ProductModel extends TimeStamps {
  @prop()
  image: string;

  @prop()
  title: string;

  @prop()
  price: number;

  @prop()
  oldPrice?: number;

  @prop()
  credit: number;

  @prop()
  calculatedRating: number;

  @prop()
  description: string;

  @prop()
  advantages: string;

  @prop()
  disadvantages: string;

  @prop({ type: () => [String] })
  categories: Array<string>;

  @prop()
  tags: string;

  @prop({ type: () => ProductCharacteristics, _id: false })
  characteristics: Array<ProductCharacteristics>;
}
