import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserSector } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {

    // 🔥 Inicializamos el mock
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,

        // 🟦 MOCK DEL JWT SERVICE (evita el error del secret)
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake_jwt_token'),
          },
        },

        // 🟩 MOCK DEL REPOSITORIO
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // ===============================================================
  //                       TEST REGISTER
  // ===============================================================

  it('should register a new user', async () => {
    const dto = {
      name: 'New',
      email: 'new@example.com',
      password: '123456',
      sector: UserSector.COMERCIO,
    };

    userRepository.findOne.mockResolvedValue(null);

    const mockUser = {
      id: 'u1',
      name: dto.name,
      email: dto.email,
      role: 'user',
      sector: UserSector.COMERCIO,
    };

    userRepository.create.mockReturnValue(mockUser);
    userRepository.save.mockResolvedValue(mockUser);

    const result = await service.register(dto);

    expect(result).toEqual(
      expect.objectContaining({
        id: 'u1',
        name: 'New',
        email: 'new@example.com',
        role: 'user',
        sector: UserSector.COMERCIO,
      }),
    );
  });

  // ===============================================================
  //                       TEST LOGIN
  // ===============================================================

  it('should login a user with valid credentials', async () => {
    const dto = {
      email: 'test@example.com',
      password: '123456',
    };

    const mockUser = {
      id: 'u1',
      email: dto.email,
      password: await bcrypt.hash('123456', 10),
      role: 'user',
      sector: UserSector.COMERCIO,
    };

    userRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.login(dto);

    expect(result).toHaveProperty('access_token');
    expect(result.access_token).toBe('fake_jwt_token'); // opcional
  });
});
