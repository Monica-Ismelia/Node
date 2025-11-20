import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async create(file: Express.Multer.File, userId: string) {
    const newFile = this.fileRepository.create({
      originalName: file.originalname,
      storedName: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      user: { id: userId },
    });
    return this.fileRepository.save(newFile);
  }

  async findAllByUser(userId: string, page: number, limit: number) {
    const [files, total] = await this.fileRepository.findAndCount({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: files,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    };
  }
}
