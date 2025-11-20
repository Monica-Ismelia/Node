import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class SendEmailDto { // Define el DTO para enviar correos electrónicos
  @ApiProperty({
    name: 'to',// Nombre de la propiedad
    required: true,// Indica que el campo es obligatorio
    type: String, // Tipo de dato String
    description: 'Correo electrónico del destinatario.',// Descripción del campo
    example: 'example@test.com', // Ejemplo de correo electrónico
  })
  @IsEmail()
  @IsNotEmpty() // Valida que el campo no esté vacío
  to: string;

  @ApiProperty({
    name: 'fileId',
    required: true,
    type: String,
    description: 'ID del archivo previamente subido que será enviado como adjunto.',
    example: 'a3f1e1d3-9b2c-4c28-85af-f0a8f3e1a4b2',
  })
  @IsNotEmpty() // Valida que el campo no esté vacío
  @IsUUID() // Valida que el campo sea un UUID válido
  fileId: string; // ID del archivo a enviar como adjunto
}