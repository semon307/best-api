import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model/top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { TOP_PAGE_NOT_FOUND } from './top-page.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const topPage = await this.topPageService.findById(id);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }
    return topPage;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const topPage = await this.topPageService.deleteById(id);
    if (!topPage) {
      throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: TopPageModel,
  ) {
    const topPage = await this.topPageService.updateById(id, dto);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }
    return topPage;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findWidthFirstCategory(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.topPageService.findByText(text);
  }
}
