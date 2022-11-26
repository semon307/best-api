import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { CreateProductDto } from '../src/product/dto/create-product.dto';
import { CreateTopPageDto } from '../src/top-page/dto/create-top-page.dto';
import { FindTopPageDto } from '../src/top-page/dto/find-top-page.dto';

// const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
  login: 'a@a.ru',
  password: '1',
};

const testTopPageDto1: CreateTopPageDto = {
  firstCategory: 0,
  secondCategory: '1',
  title: 'typescript',
  category: 'category',
  advantages: [{ title: 'test advantage', description: 'stupid description' }],
  seoText: 'seo text',
  tagsTitle: 'text',
  tags: ['text'],
};

const testTopPageDto2: CreateTopPageDto = {
  firstCategory: 0,
  secondCategory: '1',
  title: 'Test additional',
  category: 'category 123',
  advantages: [{ title: 'test advantage', description: 'stupid description' }],
  seoText: 'seo text',
  tagsTitle: 'text',
  tags: ['text'],
};

const testFindTopPageDto: FindTopPageDto = {
  firstCategory: 0,
};

describe('TopPageController (e2e)', () => {
  let app: INestApplication;
  let createdTopPagetId1: string;
  let createdTopPagetId2: string;
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

  it('/top-page/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/top-page/create')
      .set('Authorization', `Bearer ${token}`)
      .send(testTopPageDto1)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdTopPagetId1 = body._id;
        expect(createdTopPagetId1).toBeDefined();
        expect(body.category).toBe(testTopPageDto1.category);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/top-page/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/top-page/create')
      .set('Authorization', `Bearer ${token}`)
      .send(testTopPageDto2)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdTopPagetId2 = body._id;
        expect(createdTopPagetId2).toBeDefined();
        expect(body.category).toBe(testTopPageDto2.category);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/top-page/:id (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/top-page/' + createdTopPagetId1)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.title).toBe(testTopPageDto1.title);
      });
  });

  it('/top-page/:id (PATCH) - update first object success', async () => {
    return request(app.getHttpServer())
      .patch('/top-page/' + createdTopPagetId1)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'CHANGED TITLE' })
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.title).toBe('CHANGED TITLE');
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/top-page/textSearch/:text (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/top-page/textSearch/' + testTopPageDto1.title)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body[0].title).toBe(testTopPageDto1.title);
      });
  });

  it('/top-page/find (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/top-page/find')
      .set('Authorization', `Bearer ${token}`)
      .send(testFindTopPageDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body[0].pages.length).toBe(2);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/top-page/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/top-page/' + createdTopPagetId1)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/top-page/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/top-page/' + createdTopPagetId2)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(() => {
    disconnect();
  });
});
