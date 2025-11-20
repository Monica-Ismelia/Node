import { ApiProperty } from '@nestjs/swagger'; // Importa  ejemplo  para que los usuarios sepan el formato esperado
import { IsEmail, IsNotEmpty } from 'class-validator'; // Importa los validadores necesarios

export class LoginDto {// Define la clase LoginDto


  @ApiProperty({
    name: 'email',
    required: true,
    type: String,
    description: 'Correo electrónico registrado en el sistema.',
    example: 'example@test.com',
  }) // Proporciona un ejemplo para la documentación Swagger
  @IsEmail() // Valida que el campo sea un correo electrónico válido
  email: string;

  @ApiProperty({
    name: 'password',
    required: true,
    type: String,
    description: 'Contraseña asociada al usuario.',
    example: '123456',
  }) // Proporciona un ejemplo para la documentación Swagger
  @IsNotEmpty() // Valida que el campo no esté vacío
  password: string;
}
