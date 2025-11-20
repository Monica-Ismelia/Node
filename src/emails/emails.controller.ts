import { Controller, Post, Body, UseGuards, Req, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendEmailDto } from './dto/send-email.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Emails')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('mail')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}


  @ApiOperation({
    summary: 'Enviar un correo con archivo adjunto',
    description:
      'Envía un correo electrónico desde el usuario autenticado hacia el destinatario indicado.'
  })
  @ApiBody({
    type: SendEmailDto,
    description: 'Datos necesarios para enviar el correo: destinatario y ID del archivo adjunto.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Correo enviado exitosamente. Se ha generado un registro en el historial.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Solicitud inválida. Puede deberse a formato de correo incorrecto, fileId inválido o campos faltantes.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'No autorizado. El usuario no está autenticado o el token JWT es inválido/expirado.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'No se encontró el archivo indicado por fileId o el recurso relacionado no existe.',
  })
  @Post('send')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async sendEmail(@Body() dto: SendEmailDto, @Req() req) {
    return this.emailsService.send(dto, req.user.id);
  }
}
