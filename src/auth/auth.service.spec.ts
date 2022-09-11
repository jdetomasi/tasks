import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../user/entities/user.entity';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  const mockedUserService = {
    findByUsername: jest.fn(),
  };
  const mockedJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: UserService,
          useValue: mockedUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // clean up mocks
    mockedUserService.findByUsername.mockReset();
    mockedJwtService.sign.mockReset();
  });

  describe('validateUser', () => {
    it('should validate user if password matches', async () => {
      const password = await bcrypt.hash('password', 10);
      const user: User = {
        username: 'test',
        password,
      } as User;
      mockedUserService.findByUsername.mockResolvedValue(user);

      const result = await service.validateUser('username', 'password');

      expect(result).toStrictEqual({ username: 'test' });
    });

    it('should not validate user if password is incorrect', async () => {
      const password = await bcrypt.hash('password', 10);
      const user: User = {
        password,
      } as User;
      mockedUserService.findByUsername.mockResolvedValue(user);

      const result = await service.validateUser('username', 'pp');

      expect(result).toBe(null);
    });
  });

  describe('login', () => {
    it('should login', async () => {
      await service.login({
        username: 'test_user',
        _id: new Types.ObjectId(),
      } as UserDocument);
      expect(mockedJwtService.sign).toBeCalled();
    });
  });
});
