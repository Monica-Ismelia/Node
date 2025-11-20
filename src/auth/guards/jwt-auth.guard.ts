import { Injectable } from '@nestjs/common'; // Importa el decorador Injectable
import { AuthGuard } from '@nestjs/passport'; // Importa AuthGuard de passport-jwt

@Injectable() // Marca la clase JwtAuthGuard como inyectable
export class JwtAuthGuard extends AuthGuard('jwt') {}//
// Extiende AuthGuard con la estrategia 'jwt' para proteger rutas con JWT
