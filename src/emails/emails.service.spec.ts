import { Test, TestingModule } from '@nestjs/testing';
import { EmailsService } from './emails.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from './entities/email.entity';
import { File } from '../files/entities/file.entity';
import { User } from '../auth/entities/user.entity';

// Mock Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn().mockResolvedValue({ id: 'mockedEmailId' }),
      },
    })),
  };
});

describe('EmailsService', () => {
  let service: EmailsService;
  let emailRepository: jest.Mocked<Repository<Email>>;
  let fileRepository: jest.Mocked<Repository<File>>;

  const mockFile = {
    id: 'file1',
    originalName: 'documento.pdf',
    path: '/uploads/documento.pdf',
    user: { id: 'user123' },
  } as File;

 const mockEmailRepository = {
  create: jest.fn().mockImplementation((data) => ({
    id: 'email123',
    ...data,
  })),
  save: jest.fn().mockImplementation(async (data) => ({
    id: 'email123',
    ...data,
  })),
};

const mockFileRepository = {
  findOne: jest.fn().mockResolvedValue({
    id: 'file1',
    originalName: 'documento.pdf',
    path: '/uploads/documento.pdf',
    user: { id: 'user123' },
  }),
};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        { provide: getRepositoryToken(Email), useValue: mockEmailRepository },
        { provide: getRepositoryToken(File), useValue: mockFileRepository },
      ],
    }).compile();

    service = module.get<EmailsService>(EmailsService);
    emailRepository = module.get(getRepositoryToken(Email));
    fileRepository = module.get(getRepositoryToken(File));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('envía correo y guarda historial', async () => {
    const dto = { to: 'destino@example.com', fileId: 'file1' };
    const userId = 'user123';

    const result = await service.send(dto, userId);

    expect(fileRepository.findOne).toHaveBeenCalledWith({
      where: { id: dto.fileId, user: { id: userId } },
    });

    expect(result).toHaveProperty('id', 'email123');

    expect(emailRepository.create).toHaveBeenCalled();
    expect(emailRepository.save).toHaveBeenCalled();
  });
});
