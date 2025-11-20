import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),// Importa la entidad User para usarla con TypeORM
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_jwt_2025', // Clave secreta para firmar los JWT
      signOptions: { expiresIn: '1d' }, // Opciones para la firma del JWT, en este caso, el token expira en 1 día
    }),
  ],
  controllers: [AuthController], // Registra el AuthController en el módulo
  providers: [AuthService, JwtStrategy], // Registra los proveedores AuthService y JwtStrategy
  exports: [AuthService], // Exporta AuthService para que pueda ser utilizado en otros módulos
}) // Define el módulo de autenticación
export class AuthModule {}
