import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from '../common/decorators/user.decorator';
import { MongoMemoryServerHelper } from '../common/tests/mongo-memory-server.helper';
import { UserDocument, UserSchema } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController - Integration Test', () => {
  let mongoMemoryServerHelper: MongoMemoryServerHelper;
  let userModel: Model<UserDocument>;
  const mockedJwtService = {
    sign: jest.fn(),
  };

  let controller: AuthController;

  beforeAll(async () => {
    // Setup and connect to mongodb in-memory server
    mongoMemoryServerHelper = await MongoMemoryServerHelper.start();

    userModel = mongoMemoryServerHelper.getModelFromMongoMemoryServer(
      User.name,
      UserSchema,
    ) as Model<UserDocument>;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
      ],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(async () => {
    await mongoMemoryServerHelper.dropAllData();
  });

  afterAll(async () => {
    await mongoMemoryServerHelper.stop();
  });

  describe('login', () => {
    it('should return auth_token', async () => {
      mockedJwtService.sign.mockReturnValue('token');
      const result = await controller.login({
        user: 'user',
      } as any);
      expect(result?.access_token).toBe('token');
    });
  });
});
