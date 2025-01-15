import { Body, Controller, Post } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post()
  async createInvoice(@Body('invoiceId') invoiceId: string) {
    try {
      const filePath = await this.pdfService.createInvoice(invoiceId); // Gọi service để lưu file
      return { message: 'PDF created successfully', filePath }; // Trả về đường dẫn file đã lưu
    } catch (error) {
      return { message: 'Failed to create PDF', error: error.message };
    }
  }
}
