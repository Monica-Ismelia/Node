import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';// Importa los decoradores necesarios de TypeORM
import { File } from '../../files/entities/file.entity'; // Importa la entidad File
import { Email } from '../../emails/entities/email.entity';// Importa la entidad Email

export enum UserSector { // Define el enum UserSector
  COMERCIO = 'comercio',
  BANCA = 'banca',
  EDUCACION = 'educacion',
}

@Entity({ name: 'users' }) // Define la entidad User y especifica el nombre de la tabla como 'users'
export class User {
  @PrimaryGeneratedColumn('uuid') // Define la  llave primaria generada automáticamente como UUID
  id: string;

  @Column({ length: 120 }) // Define la columna name con una longitud máxima de 120 caracteres
  name: string; // Define la propiedad name de tipo string

  @Column({ length: 160, unique: true }) // Define la columna email con una longitud máxima de 160 caracteres y valor único
  email: string; // Define la propiedad email de tipo string

  @Column({ select: false }) // Define la columna password y la excluye de las consultas por defecto
  password: string; // Define la propiedad password de tipo string

  @Column({ default: 'user' }) // Define la columna role con un valor por defecto 'user'
  role: 'user' | 'admin'; // Define la propiedad role que puede ser 'user' o 'admin'

  @Column({ // Define la columna sector usando el enum UserSector
    type: 'enum',
    enum: UserSector,
    default: UserSector.COMERCIO,
  })
  sector: UserSector;

  @OneToMany(() => File, file => file.user) // Define la relación uno a muchos con la entidad File
  files: File[];

  @OneToMany(() => Email, email => email.sender) // Define la relación uno a muchos con la entidad Email
  sentEmails: Email[];

  @CreateDateColumn() // Define la columna createdAt que almacena la fecha de creación del registro
  createdAt: Date;

  @UpdateDateColumn() // Define la columna updatedAt que almacena la fecha de la última actualización del registro
  updatedAt: Date;
}