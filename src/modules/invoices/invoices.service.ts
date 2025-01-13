import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/requestDTO/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/requestDTO/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { Order } from '../orders/schemas/order.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) { }


  async create(createInvoiceDto: CreateInvoiceDto) {
    const orders = await this.orderModel.find({ _id: { $in: createInvoiceDto.orderId } })
      .populate('products.product', 'name price')
      .lean();
    if (orders.length !== createInvoiceDto.orderId.length) {
      throw new NotFoundException('Order not found');
    }
    const orderTranfer = JSON.parse(JSON.stringify(orders));
    const result = orderTranfer.reduce(
      (acc, order) => {
        // Gộp sản phẩm vào acc.products, đồng thời tính tổng tiền cho từng sản phẩm
        const updatedProducts = order.products.map(product => ({
          ...product,
          totalPrice: product.product.price * product.quantity, // Thêm tổng tiền cho từng sản phẩm
        }));

        acc.products = acc.products.concat(updatedProducts); // Gộp sản phẩm vào mảng tổng
        acc.totalAmount += updatedProducts.reduce(
          (sum, product) => sum + product.totalPrice,
          0
        ); // Tính tổng tiền từ tất cả các sản phẩm

        return acc;
      },
      { totalAmount: 0, products: [] } // Giá trị khởi tạo
    );
    const newInvoice = await this.invoiceModel.create({
      orderIds: createInvoiceDto.orderId,
      items: result.products,
      totalPrice: result.totalAmount,
      note: createInvoiceDto.note,
    });

    return newInvoice;
  }


  async findAll() {
    return await this.invoiceModel
      .find()
      .populate('items.product', 'name price')
      .lean();
  }

  async findOne(invoiceId: string) {
    const invoice = await this.invoiceModel.findById(invoiceId)
      .populate('items.product', 'name price')
      .lean();
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }


  async remove(invoiceId: string) {
    const invoice = await this.invoiceModel.findByIdAndDelete(invoiceId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }
}
