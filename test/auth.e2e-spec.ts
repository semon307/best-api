import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  login: 'a@a.ru',
  password: '1',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
        expect(body.access_token.length).toBeGreaterThan(5);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/auth/login (POST) - fail: password is wrong', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '12' })
      .expect(401)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeUndefined();
        expect(body.message).toBe('Wrong password');
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/auth/login (POST) - fail: user not found', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'sa@as.ru' })
      .expect(401)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeUndefined();
        expect(body.message).toBe('User with this login is not found');
      })
      .catch((error) => {
        console.log(error);
      });
  });

  afterAll(() => {
    disconnect();
  });
});
