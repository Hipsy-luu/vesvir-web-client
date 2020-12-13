import { Test, TestingModule } from '@nestjs/testing';
import { MailCenterController } from './mail-center.controller';

describe('MailCenter Controller', () => {
  let controller: MailCenterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailCenterController],
    }).compile();

    controller = module.get<MailCenterController>(MailCenterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
