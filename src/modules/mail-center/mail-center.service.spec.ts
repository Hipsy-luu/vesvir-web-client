import { Test, TestingModule } from '@nestjs/testing';
import { MailCenterService } from './mail-center.service';

describe('MailCenterService', () => {
  let service: MailCenterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailCenterService],
    }).compile();

    service = module.get<MailCenterService>(MailCenterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
