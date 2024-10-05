import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UserDocument } from 'src/users/user.entity';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/users/dto';

//jest.setTimeout(10000);

describe('Users e2e', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let userModel: Model<UserDocument>;

  const createUserDto: CreateUserDto = {
    email: 'lkjqhsdf@ljikbhdfs.com',
    password: 'lhqbsdflkjbdfs',
    userName: 'name',
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    process.env.MONGODB_URI = mongoUri;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userModel = app.get(getModelToken('User'));
  });

  beforeEach(async () => {
    if (mongoServer.state === 'stopped') {
      return mongoServer.start(true);
    }
  });

  afterEach(async () => {
    // Supprime toutes les collections après chaque test
    return userModel.deleteMany();
  });

  afterAll(async () => {
    await Promise.all([mongoServer.stop(), app.close()]);
  });

  describe('signup', () => {
    it(`signup correctly`, async () => {
      const { body } = await request(app.getHttpServer())
        .post('/signup')
        .send(createUserDto)
        .expect(201);

      expect(body).toEqual({});
    });

    it('should fail if the userName field is empty', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/signup')
        .send({ ...createUserDto, userName: undefined })
        .expect(400);

      expect(body.message[0]).toEqual('userName must be a string');
    });

    it('should fail if the password field is empty', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/signup')
        .send({ ...createUserDto, password: undefined })
        .expect(400);

      expect(body.message[0]).toEqual('password must be a string');
    });

    it('should fail if the email is already in use', async () => {
      await userModel.create({
        email: createUserDto.email,
        password: '3456789765',
        userName: createUserDto.userName,
      });

      const { body } = await request(app.getHttpServer())
        .post('/signup')
        .send(createUserDto)
        .expect(400);

      expect(body.message).toEqual('This email already exits.');
    });

    it('should hash the password', async () => {
      await request(app.getHttpServer())
        .post('/signup')
        .send(createUserDto)
        .expect(201);

      const userCreated = await userModel.findOne({
        email: createUserDto.email,
      });

      expect(userCreated?.password).not.toEqual(createUserDto.password);
    });

    it.todo(
      'should fail if the password does not meet complexity requirements',
    );
  });

  describe('signin', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/signup').send(createUserDto);
    });

    it('should get UserName and UserName when signin success', async () => {
      await request(app.getHttpServer()).post('/signin').send(createUserDto);
    });
  });
});
