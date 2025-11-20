import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/auth/entities/user.entity';
import { File } from './src/files/entities/file.entity';
import { Email } from './src/emails/entities/email.entity';

// Cargar variables de entorno (necesario para que la CLI de TypeORM pueda leer .env)
dotenv.config();

const config: DataSourceOptions = {
    type: 'postgres',
    
    // --- Prioriza DATABASE_URL (para Render/producción) ---
    url: process.env.DATABASE_URL, 
    
    // --- Usa variables individuales si DATABASE_URL no existe (para local) ---
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'gestor_archivos_db',
    
    // --- Configuración de Entidades y Migraciones ---
    entities: [User, File, Email],
    // ⚠️ Importante: Ajusta esta ruta si tus migraciones no están aquí
    migrations: ['dist/db/migrations/*.js'], 
    synchronize: false, 
    logging: false,

    // --- Configuración SSL (Necesaria para Render) ---
    ssl: process.env.DATABASE_URL ? {
        rejectUnauthorized: false,
    } : false as any, // false para desarrollo local
};

export const AppDataSource = new DataSource(config);
