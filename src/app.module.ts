// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { EmailsModule } from './emails/emails.module';
import { User } from './auth/entities/user.entity';
import { File } from './files/entities/file.entity';
import { Email } from './emails/entities/email.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // ✅ Soporte para DATABASE_URL (Render) y variables individuales (local)
        const databaseUrl = configService.get('DATABASE_URL');
        
        // --- 1. CONFIGURACIÓN PARA RENDER/PRODUCCIÓN (USA DATABASE_URL) ---
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, File, Email],
            synchronize: true, // ¡Nunca en producción!
            logging: false,
            // 🔑 SOLUCIÓN SSL/TLS REQUERIDA POR RENDER
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }

        // --- 2. CONFIGURACIÓN PARA DESARROLLO (USA VARIABLES DB_...) ---
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432), // Se corrigió la interpolación del puerto
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'gestor_archivos_db'),
          entities: [User, File, Email],
          // Se usa la variable de entorno para controlar 'synchronize' (ej: NODE_ENV=development)
          synchronize: configService.get('NODE_ENV') !== 'production', 
          logging: false,
        };
      },
    }),

    AuthModule,
    FilesModule,
    EmailsModule,
  ],
})
export class AppModule {}