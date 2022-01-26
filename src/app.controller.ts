import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SendMailService } from './services/mailer/send-mail.service';
import { PdfGeneratorService } from './services/pdf-generator/pdf-generator.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private emailService:SendMailService,private pdfService:PdfGeneratorService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('pdf-test')
  async pdf() {
    await this.pdfService.genPDFtest();
    return this.appService.getHello();
  }

  @Get('email-test')
  async email() {
    await this.emailService.sendTest();
    return this.appService.getHello();
  }
}
