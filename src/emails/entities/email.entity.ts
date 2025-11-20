export class Emails {}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { File } from '../../files/entities/file.entity';

@Entity({ name: 'emails' })
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string;

  @Column()
  subject: string;

  @Column({ nullable: true }) // El campo puede ser nulo
  fileId: string;

  @ManyToOne(() => File, { onDelete: 'SET NULL' }) // Si el archivo es eliminado, establece file en NULL
  file: File;// Relación Many-to-One con la entidad File

  @ManyToOne(() => User)// Relación Many-to-One con la entidad User
  sender: User;// Usuario que envió el correo

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })// Establece la fecha y hora actual por defecto
  sentAt: Date;

  @CreateDateColumn() // Columna para la fecha de creación del registro
  createdAt: Date;
}