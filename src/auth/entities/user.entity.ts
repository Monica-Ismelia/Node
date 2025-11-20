import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';

import { File } from '../../files/entities/file.entity';
import { Email } from '../../emails/entities/email.entity';

export enum UserSector {
  COMERCIO = 'comercio',
  BANCA = 'banca',
  EDUCACION = 'educacion',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 160, unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @Column({
    type: 'enum',
    enum: UserSector,
    default: UserSector.COMERCIO,
  })
  sector: UserSector;

  @OneToMany(() => File, file => file.user)
  files: File[];

  @OneToMany(() => Email, email => email.sender)
  sentEmails: Email[];
@CreateDateColumn({ name: 'created_at' })
createdAt: Date;

@UpdateDateColumn({ name: 'updated_at' })
updatedAt: Date;

  /* ------------------------- */
  /* NORMALIZACIÓN AUTOMÁTICA */
  /* ------------------------- */
  
  @BeforeInsert()
  @BeforeUpdate()
  normalizeSector() {
    if (this.sector) {
      this.sector = this.sector.toString().toLowerCase() as UserSector;
    }
  }
}
