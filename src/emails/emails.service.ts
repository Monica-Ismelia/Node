import { Injectable, NotFoundException } from '@nestjs/common';
import { Resend } from 'resend';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from './entities/email.entity';
import { File } from '../files/entities/file.entity';
import { User } from '../auth/entities/user.entity';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailsService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async send(dto: SendEmailDto, userId: string) {
  // ✅ Verifica que el archivo exista y pertenezca al usuario
    const file = await this.fileRepository.findOne({ where: { id: dto.fileId, user: { id: userId } } });
    if (!file) throw new NotFoundException('Archivo no encontrado o no autorizado');

    // Enviar correo con adjunto
    await this.resend.emails.send({
      from: 'ArchivaSend <filemail@yourdomain.com>',
      to: dto.to,
      subject: `Archivo adjunto: ${file.originalName}`,
      text: 'Tu archivo está adjunto.',
      attachments: [{ filename: file.originalName, path: file.path }],
    });

    // Guardar historial en BD
    const email = this.emailRepository.create({
      to: dto.to,
      subject: `Archivo adjunto: ${file.originalName}`,
      fileId: file.id,
      sender: { id: userId } as User,
      sentAt: new Date(),
    });

    return this.emailRepository.save(email);
  }
}
