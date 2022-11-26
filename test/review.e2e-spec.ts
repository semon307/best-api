import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
  login: 'a@a.ru',
  password: '1',
};

const testDto: CreateReviewDto = {
  name: 'Тест',
  title: 'Заголовок',
  description: 'Описание тестовое',
  rating: 5,
  productId,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
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

  it('/review/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .set('Authorization', `Bearer ${token}`)
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/review/create (POST) - fail (bad rating)', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testDto, rating: 6 })
      .expect(400)
      .then(({ body }: request.Response) => {
        console.log('body>>>>', body);
      });
  });

  it('/review/byProduct/:productId (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      });
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(() => {
    disconnect();
  });
});
