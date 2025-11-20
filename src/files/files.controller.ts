// src/files/files.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Request } from 'express';

import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Files')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}


  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir (jpg, jpeg, png, pdf, doc, docx)',
        },
      },
      required: ['file'],
    },
  })
  @ApiOperation({
    summary: 'Subir archivo',
    description:
      'Permite que el usuario autenticado suba un archivo al servidor.',
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El archivo no es válido.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
  destination: './uploads', // ← Carpeta relativa
  filename: (req, file, cb) => {
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
}),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf|doc|docx)$/)) {
          return cb(new Error('Solo se permiten imágenes y documentos'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    return this.filesService.create(file, userId);
  }


  @Get()
  @ApiOperation({
    summary: 'Listar archivos del usuario',
    description:
      'Devuelve la lista de archivos subidos por el usuario autenticado con paginación.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para la paginación',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número de elementos por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de archivos.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    return this.filesService.findAllByUser(userId, page, limit);
  }
}
