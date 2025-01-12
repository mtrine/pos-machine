import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/requestDTO/create-order.dto';
import { UpdateOrderDto } from './dto/requestDTO/update-order.dto';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Table } from '../tables/schemas/table.schema';
import { Product } from '../products/schemas/product.schema';
import { TableStatus } from 'src/enums/table-status.enum';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { OrderStatus } from 'src/enums/oder-status.enum';
import { stat } from 'fs';


@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Table.name) private readonly tableModel: Model<Table>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  async create(createOrderDto: CreateOrderDto) {


    // Kiểm tra đơn hàng hiện tại với trạng thái khác PAID
    // const existingOrder = await this.orderModel.findOne({
    //   'table._id': createOrderDto.tableId,
    //   status: { $ne: OrderStatus.PAID },
    // });

    // if (existingOrder) {
    //   // Cập nhật đơn hàng hiện tại
    //   items.forEach(newItem => {
    //     const existingItem = existingOrder.product.find(item => item._id.toString() === newItem._id.toString());
    //     if (existingItem) {
    //       existingItem.quantity += newItem.quantity;
    //       existingItem.note = newItem.note || existingItem.note;
    //     } else {
    //       existingOrder.product.push(newItem);
    //     }
    //   });
    //   const updateOrderDto = {
    //     status: OrderStatus.PREPARING,
    //   } as UpdateOrderDto;
    //   await this.update(existingOrder._id.toString(), updateOrderDto );
    //   return existingOrder;
    // }

    // Nếu không có đơn hàng hiện tại, tạo đơn hàng mới
    const newOrder = await this.orderModel.create({
      ...createOrderDto,
      products: createOrderDto.items,
      table: createOrderDto.tableId,
    });

    // table.status = TableStatus.BUSY;
    // await table.save();

    return newOrder;
  }



  findAll(limit = 50, page = 1) {
    return this.orderModel.find()
      .populate('table', 'tableNumber')
      .populate({
        path: 'products.product', // Populate thông tin sản phẩm
        select: 'name price', // Chỉ lấy các trường cần thiết từ Product
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()
      .exec();
  }

  async findOne(id: string) {
    // Kiểm tra cache trước
    const cachedOrder = await this.cacheManager.get<Order>(`order:${id}`);
    if (cachedOrder) {
      return cachedOrder;
    }

    // Nếu không có trong cache, lấy từ DB
    const order = await this.orderModel.findById(id)
      .populate('table', 'tableNumber')
      .populate({
        path: 'products.product', // Populate thông tin sản phẩm
        select: 'name price', // Chỉ lấy các trường cần thiết từ Product
      })
      .lean();
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Lưu vào cache và trả về
    await this.cacheManager.set(`order:${id}`, order);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    this.cacheManager.del(`order:${id}`);
    return order;
  }

  remove(id: string) {
    const order = this.orderModel.findByIdAndDelete(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    this.cacheManager.del(`order:${id}`);

    return order;
  }
}
