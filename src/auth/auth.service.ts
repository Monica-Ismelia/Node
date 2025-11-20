import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserSector } from './entities/user.entity'; // Asegúrate de importar UserSector

@Injectable()
export class AuthService { // Marca la clase AuthService como inyectable
  constructor(
    @InjectRepository(User) // Inyecta el repositorio de User
    private userRepository: Repository<User>, // Define el repositorio de User como privado
    private jwtService: JwtService, // Inyecta el servicio JWT
  ) {} 

  async register(dto: RegisterDto) { // Método para registrar un nuevo usuario
    const exists = await this.userRepository.findOne({ where: { email: dto.email } }); // Verifica si ya existe un usuario con el mismo email
    if (exists) throw new BadRequestException('Email already exists'); // Lanza una excepción si el email ya está registrado

    const hashed = await bcrypt.hash(dto.password, 10); // Hashea la contraseña del usuario
    const user = this.userRepository.create({ // Crea una nueva entidad User
      name: dto.name,
      email: dto.email,
      password: hashed,
      sector: dto.sector || UserSector.COMERCIO, // ✅ Usa el enum
    });
    await this.userRepository.save(user);
    
    // ✅ Elimina password de forma segura antes de retornar el usuario
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async login(dto: LoginDto) { // Método para iniciar sesión de un usuario
    const user = await this.userRepository.findOne({ 
      where: { email: dto.email }, 
      select: ['id', 'email', 'password', 'role', 'sector'] 
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) { // Verifica las credenciales del usuario
      throw new UnauthorizedException('Invalid credentials'); // Lanza una excepción si las credenciales son inválidas
    }
    const payload = {  // Crea el payload para el token JWT
      sub: user.id,  // Añade el ID del usuario al payload
      email: user.email, // Añade el email al payload
      role: user.role, // Añade el rol al payload
      sector: user.sector // Añade el sector al payload
    };
    return { access_token: this.jwtService.sign(payload) }; // Retorna un token JWT firmado con el payload
  }
}
