import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  const mockedAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockedAuthService,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);

    // clean up mocks
    mockedAuthService.validateUser.mockReset();
  });

  describe('validate', () => {
    it('should validate user', async () => {
      const user = { _id: new Types.ObjectId(), enabled: true };
      mockedAuthService.validateUser.mockResolvedValue(user);

      const result = await localStrategy.validate('username', 'password');

      expect(result).toStrictEqual(user);
    });

    it('should throw an error if the username/password is not valid', async () => {
      try {
        mockedAuthService.validateUser.mockResolvedValue(null);

        await localStrategy.validate('username', 'password');

        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
