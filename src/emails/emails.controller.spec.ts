import { Test, TestingModule } from '@nestjs/testing';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

describe('EmailsController', () => { // Pruebas unitarias para EmailsController
  let controller: EmailsController;// Instancia del controlador a probar

  const mockEmailService = { // Mock del servicio de correos electrónicos
    send: jest.fn(), // Mock de la función send
  };

  beforeEach(async () => { // Se ejecuta antes de cada prueba
    const module: TestingModule = await Test.createTestingModule({ // Crea un módulo de prueba
      controllers: [EmailsController], // Registra el controlador a probar
      providers: [ // Registra los proveedores necesarios
        { provide: EmailsService, useValue: mockEmailService },// Usa el mock del servicio de correos electrónicos
      ],
    }).compile();// Compila el módulo de prueba

    controller = module.get<EmailsController>(EmailsController); // Obtiene la instancia del controlador
  });

  it('should be defined', () => {// Prueba para verificar que el controlador esté definido
    expect(controller).toBeDefined(); // Verifica que la instancia del controlador no sea undefined
  }); // Cierra la prueba
});// Cierra la descripción de las pruebas
