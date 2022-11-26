import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { TopPageModel } from './top-page.model/top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
    return this.topPageModel.create(dto);
  }

  async findById(id: string): Promise<TopPageModel> {
    return this.topPageModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWidthFirstCategory(dto: FindTopPageDto) {
    return this.topPageModel
      .aggregate()
      .match({ firstCategory: dto.firstCategory })
      .group({
        _id: { secondCategory: '$secondCategory' },
        pages: { $push: { alias: '$alias', title: '$title' } },
      })
      .exec();
    //    .find({ dto }, { alias: 1, secondCategory: 1, title: 1 })
    // .aggregate([
    //   {
    //     $match: {
    //       firstCategory: dto.firstCategory,
    //     },
    //   },
    // ])
    // .exec();
  }

  async findByText(text: string) {
    return this.topPageModel
      .find({ $text: { $search: text, $caseSensitive: false } })
      .exec();
  }
}
