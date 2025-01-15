import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument = require('pdfkit'); // Thay đổi cách import
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from '../invoices/schemas/invoice.schema';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PdfService {
  private readonly projectRoot: string;

  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
  ) {
    this.projectRoot = path.resolve(__dirname, '../../../../');
  }

  async createInvoice(invoiceId: string): Promise<string> {
    const invoice = await this.invoiceModel
      .findById(invoiceId)
      .populate('orderIds', 'createdAt')
      .populate('items.product', 'name price')
      .lean();

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    const totalHeight = this.calculateHeight(invoice.items.length);

    const doc = new PDFDocument({
      size: [226.77, totalHeight],
      margin: 20,
      bufferPages: true,
    });

    const filePath = path.join(
      this.projectRoot,
      'invoices',
      'storage',
      'pdf',
      `invoice-${invoiceId}.pdf`,
    );
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const fileStream = fs.createWriteStream(filePath);
    doc.pipe(fileStream);

    // **Load Font**
    const regularFont = path.join(
      this.projectRoot,
      'invoices',
      'assets',
      'font',
      'static',
      'Roboto-Regular.ttf',
    );
    const boldFont = path.join(
      this.projectRoot,
      'invoices',
      'assets',
      'font',
      'static',
      'Roboto-Bold.ttf',
    );

    doc.font(regularFont);

    // Header
    this.generateHeader(doc, boldFont);

    // Invoice Info
    this.generateInvoiceInfo(doc, invoice);

    // Items Table
    this.generateItemsTable(doc, invoice.items);

    // Summary
    this.generateSummary(doc, invoice);

    // Footer
    this.generateFooter(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      fileStream.on('finish', () => {
        resolve(filePath);
      });
      fileStream.on('error', (error) => {
        reject(error);
      });
    });
  }

  private generateHeader(doc: PDFKit.PDFDocument, boldFont: string): void {
    doc
      .font(boldFont) // Sử dụng font in đậm
      .fontSize(10)
      .text('HÓA ĐƠN BÁN HÀNG', { align: 'center' });
  }

  private generateInvoiceInfo(doc: PDFKit.PDFDocument, invoice: any): void {
    doc
      .fontSize(8)
      .text(`Mã hóa đơn: ${invoice._id}`)
      .text(
        `Ngày tạo: ${new Date(invoice.createdAt).toLocaleDateString('vi-VN')}`,
      )
      .text('-----------------------------------------------------------');
  }

  private generateItemsTable(doc: PDFKit.PDFDocument, items: any[]): void {
    const tableTop = 60;

    // Draw Headers
    doc
      .fontSize(7)
      .text('Tên món', 20, tableTop)
      .text('Số lượng', 85, tableTop)
      .text('Đơn giá', 127, tableTop)
      .text('Thành tiền', 170, tableTop);

    let y = tableTop + 10;
    items.forEach((item, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.fontSize(7).text(item.product.name, 20, y);
      doc.fontSize(7).text(item.quantity.toString(), 97, y);
      doc.fontSize(7).text(this.formatCurrency(item.product.price), 127, y);
      doc
        .fontSize(7)
        .text(this.formatCurrency(item.product.price * item.quantity), 170, y);

      y += 7;
    });
    doc
      .fontSize(8)
      .text('-----------------------------------------------------------', 20);
  }

  private generateSummary(doc: PDFKit.PDFDocument, invoice: any): void {
    doc
      .fontSize(8)
      .text(`Tổng tiền: ${this.formatCurrency(invoice.totalPrice)}`, 20);
  }

  private generateFooter(doc: PDFKit.PDFDocument): void {
    doc.fontSize(9).moveDown(1).text('Cảm ơn quý khách!', { align: 'center' });
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  private calculateHeight(quantity: number): number {
    let height = 140;
    let totalHeight = height + 7 * quantity;
    return totalHeight;
  }
}
