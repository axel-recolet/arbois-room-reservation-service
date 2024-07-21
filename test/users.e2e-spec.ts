import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Users e2e', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    process.env.MONGODB_URI = mongoUri;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await mongoServer.stop({ doCleanup: true });
    await mongoServer.start();
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it(`signup`, () => {
    const createUserDto = {
      email: 'lkjqhsdf@ljikbhdfs.com',
      password: 'lhqbsdflkjbdfs',
    };
    return request(app.getHttpServer()).post('/signup').expect(200);
  });
});
