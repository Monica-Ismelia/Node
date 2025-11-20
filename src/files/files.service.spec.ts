import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { File } from './entities/file.entity';

describe('FilesService', () => {
  let service: FilesService;
  let fileRepository: any;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: getRepositoryToken(File), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    fileRepository = module.get(getRepositoryToken(File));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crea un archivo', async () => {
    const mockFile = {
      originalname: 'doc.pdf',
      filename: 'file123.pdf',
      path: 'uploads/file123.pdf',
      size: 500,
      mimetype: 'application/pdf',
    };

    mockRepository.create.mockReturnValue(mockFile);
    mockRepository.save.mockResolvedValue({ id: 'file123', ...mockFile });

    const result = await service.create(mockFile as any, 'user123');

    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
  });

  it('lista archivos paginados', async () => {
    mockRepository.findAndCount.mockResolvedValue([[{ id: '1' }], 1]);

    const result = await service.findAllByUser('user123', 1, 10);

    expect(result.total).toBe(1);
    expect(result.data.length).toBe(1);
  });
});
