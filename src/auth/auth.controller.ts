import { Controller, Post, Body, UsePipes, ValidationPipe, HttpStatus } from '@nestjs/common'; // Importa los decoradores y utilidades necesarias de NestJS
import { AuthService } from './auth.service'; // Importa el servicio de autenticación
import { RegisterDto } from './dto/register.dto'; // Importa el DTO de registro
import { LoginDto } from './dto/login.dto'; // Importa el DTO de inicio de sesión
import { ApiBody, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger'; // Importa los decoradores de Swagger para la documentación de la API

@Controller('auth') // Define el controlador con la ruta base 'auth'
export class AuthController { // Define la clase AuthController
  constructor(private readonly authService: AuthService) {} // Inyecta el servicio de autenticación


  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description:
      'Crea un nuevo usuario en el sistema utilizando los datos proporcionados en el cuerpo de la solicitud.'
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Datos necesarios para registrar un usuario.',
  }) 
  @ApiResponse({
    status: HttpStatus.CREATED, // Código de estado 201
    description: 'Usuario registrado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST, // Código de estado 400
    description: 'Datos inválidos o faltantes en la solicitud.',
  })
  @Post('register') // Define la ruta POST /auth/register
  @UsePipes(new ValidationPipe({ whitelist: true })) // Usa el pipe de validación con la opción whitelist
  register(@Body() dto: RegisterDto) { // Método para manejar el registro de usuarios
    return this.authService.register(dto); // Llama al método register del servicio de autenticación
  } // Cierra el método register

  
  
  @ApiOperation({
    summary: 'Iniciar sesión', // Resumen de la operación
    description: 
      'Permite a un usuario registrado iniciar sesión proporcionando sus credenciales.',
  })
  @ApiBody({ 
    type: LoginDto, // Especifica el tipo de datos esperado en el cuerpo de la solicitud
    description: 'Credenciales necesarias para iniciar sesión.'
  })
  @ApiResponse({
    status: HttpStatus.CREATED, // Código de estado 201
    description: 'Inicio de sesión exitoso. se ha generado un nuevo token de autenticación.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,// Código de estado 401
    description: 'Credenciales incorrectas.'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST, // Código de estado 400
    description: 'El formato de los datos enviados no es válido.'
  })
  @Post('login') // Define la ruta POST /auth/login
  @ApiBody({ type: LoginDto }) // para mostrar el esquema en Swagger
  @ApiOperation({ summary: 'Inicio de sesión de un usuario' }) // Documenta la operación en Swagger
  @UsePipes(new ValidationPipe({ whitelist: true })) // Usa el pipe de validación con la opción whitelist
  login(@Body() dto: LoginDto) { // Método para manejar el inicio de sesión de usuarios
    return this.authService.login(dto); // Llama al método login del servicio de autenticación
  } // Cierra el método login
}
