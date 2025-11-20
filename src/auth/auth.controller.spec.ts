import { Test, TestingModule } from '@nestjs/testing'; // Importa las utilidades de testing de NestJS
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => { // Describe el conjunto de pruebas para AuthController
  let controller: AuthController; // Declara la variable controller de tipo AuthController

  beforeEach(async () => { // Antes de cada prueba, configura el módulo de testing
    const module: TestingModule = await Test.createTestingModule({ // Crea un módulo de testing para AuthController
      controllers: [AuthController], // Declara AuthController como controlador
      providers: [ // Declara los proveedores necesarios para AuthController
        AuthService, // Proveedor AuthService
        {
          provide: getRepositoryToken(User), // Proveedor del repositorio de User
          useValue: { // Mock (reemplaza la informacion real )del repositorio de User
            findOne: jest.fn(),// Mock de la función findOne 
            create: jest.fn(),// Mock de la función create
            save: jest.fn(), // Mock de la función save
            createQueryBuilder: jest.fn(), // Mock de la función createQueryBuilder
          },
        },
        {
          provide: JwtService, //
          useValue: { signAsync: jest.fn().mockResolvedValue('mocked_token') }, //
        },
      ],
    }).compile(); // Compila el módulo de testing

    controller = module.get<AuthController>(AuthController);
  }); // Obtiene una instancia de AuthController del módulo de testing

  it('should be defined', () => { // Prueba para verificar que el controlador esté definido
    expect(controller).toBeDefined(); // Espera que el controlador esté definido
  }); // Cierra la prueba
}); // Cierra el conjunto de pruebas
