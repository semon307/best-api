import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { CreateProductDto } from '../src/product/dto/create-product.dto';

// const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
  login: 'a@a.ru',
  password: '1',
};

const testProductDto: CreateProductDto = {
  image: '1.png',
  title: 'test',
  price: 100,
  oldPrice: 120,
  credit: 1,
  calculatedRating: 1,
  description: 'my first test product',
  advantages: 'too',
  disadvantages: 'ob',
  categories: ['test'],
  tags: 'booasd',
  characteristics: [],
};

const testReviewDto1: CreateReviewDto = {
  name: 'Тест',
  title: 'Заголовок',
  description: 'Описание тестовое',
  rating: 5,
  productId: null,
};

const testReviewDto2: CreateReviewDto = {
  name: 'Тест2',
  title: 'Заголовок2',
  description: 'Описание тестовое2',
  rating: 2,
  productId: null,
};

const testFindProductDto = {
  category: 'test',
  limit: 5,
};

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let createdProductId: string;
  let createdReviewId1: string;
  let createdReviewId2: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = res.body.access_token;
  });

  it('/product/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/product/create')
      .set('Authorization', `Bearer ${token}`)
      .send(testProductDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdProductId = body._id;
        expect(createdProductId).toBeDefined();
        expect(body.description).toBe(testProductDto.description);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/product/:id (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/product/' + createdProductId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.title).toBe(testProductDto.title);
      });
  });

  it('/review/create (POST) - first review to existing product success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testReviewDto1, productId: createdProductId })
      .expect(201)
      .then(({ body }: request.Response) => {
        createdReviewId1 = body._id;
        expect(body.title).toBe(testReviewDto1.title);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/review/create (POST) - second review to existing product success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testReviewDto2, productId: createdProductId })
      .expect(201)
      .then(({ body }: request.Response) => {
        createdReviewId2 = body._id;
        expect(body.title).toBe(testReviewDto2.title);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/product/find (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/product/find')
      .set('Authorization', `Bearer ${token}`)
      .send(testFindProductDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
        expect(body[0].reviews.length).toBe(2);
        expect(body[0].reviewCount).toBe(2);
        expect(body[0].reviewAvg).toBe(
          testReviewDto1.rating / testReviewDto2.rating,
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdReviewId1)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdReviewId2)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/product/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/product/' + createdProductId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(() => {
    disconnect();
  });
});
