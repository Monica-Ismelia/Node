import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController; // Declara la variable controller de tipo AuthController

  beforeEach(async () => { // Antes de cada prueba, configura el módulo de testing
    const module: TestingModule = await Test.createTestingModule({ // Crea un módulo de testing para AuthController
      controllers: [AuthController], // Declara AuthController como controlador
      providers: [ // Declara los proveedores necesarios para AuthController
        AuthService, // Proveedor AuthService
        {
          provide: getRepositoryToken(User), // Proveedor del repositorio de User
          useValue: { // Mock (reemplaza la informacion real )del repositorio de User
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: JwtService, // Proveedor del servicio JWT
          useValue: { signAsync: jest.fn().mockResolvedValue('mocked_token') }, // Mock del método signAsync que retorna un token simulado
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController); // Obtiene una instancia de AuthController del módulo de testing
  });

  it('should be defined', () => { // Prueba para verificar que el controlador esté definido
    expect(controller).toBeDefined(); // Espera que el controlador esté definido
  });
});
    
