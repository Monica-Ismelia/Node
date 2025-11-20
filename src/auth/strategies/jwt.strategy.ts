import { Injectable } from '@nestjs/common'; // Importa el decorador Injectable
import { PassportStrategy } from '@nestjs/passport';// Importa PassportStrategy de passport-jwt
import { ExtractJwt, Strategy } from 'passport-jwt'; // Importa ExtractJwt y Strategy de passport-jwt
import { InjectRepository } from '@nestjs/typeorm'; // Importa el decorador InjectRepository
import { Repository } from 'typeorm'; // Importa Repository de TypeORM
import { User } from '../entities/user.entity'; // Importa la entidad User

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // Extiende PassportStrategy con la estrategia JWT
  constructor( // Inyecta el repositorio de User
    @InjectRepository(User) 
    private userRepository: Repository<User>, // Define el repositorio de User como privado
  ) {
    super({ // Configura la estrategia JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el JWT del encabezado Authorization como Bearer token
      ignoreExpiration: false, // No ignora la expiración del token
      secretOrKey: process.env.JWT_SECRET , // Clave secreta para verificar el token
    });
  }

  async validate(payload: any) { // Método para validar el payload del JWT
    const user = await this.userRepository.findOne({ where: { id: payload.sub } }); // Busca el usuario en la base de datos usando el id del payload
    return user; // Retorna el usuario encontrado
  }
}
