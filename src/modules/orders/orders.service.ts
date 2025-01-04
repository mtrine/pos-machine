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
    const table = await this.tableModel.findById(createOrderDto.tableId);
    if (!table) {
      throw new NotFoundException('Table not found');
    }
  
    const products = await this.productModel.find({
      _id: { $in: createOrderDto.items.map(item => item.productId) }
    });
  
    if (products.length !== createOrderDto.items.length) {
      throw new NotFoundException('Product not found');
    }
  
    const items = createOrderDto.items.map(item => {
      const product = products.find(prod => prod._id.toString() === item.productId);
      return {
        _id: product._id,
        name: product.name,
        note: item.note,
        quantity: item.quantity,
      };
    });
  
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
      items: items,
      table: { _id: table._id, tableNumber: table.tableNumber },
    });
  
    table.status = TableStatus.BUSY;
    await table.save();
  
    return newOrder;
  }
  
  

  findAll(limit = 10, page = 1) {
    return this.orderModel.find().limit(limit).skip((page - 1) * limit).exec();
  }

  async findOne(id: string) {
     // Kiểm tra cache trước
     const cachedOrder = await this.cacheManager.get<Order>(`order:${id}`);
     if (cachedOrder) {
       return cachedOrder;
     }
 
     // Nếu không có trong cache, lấy từ DB
     const order = await this.orderModel.findById(id);
     if (!order) {
       throw new NotFoundException('Order not found');
     }
 
     // Lưu vào cache và trả về
     await this.cacheManager.set(`order:${id}`, order);
     return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto,{new:true});
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    this.cacheManager.del(`order:${id}`);
    return order;
  }

  remove(id: number) {
    const order = this.orderModel.findByIdAndDelete(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    this.cacheManager.del(`order:${id}`);

    return order ;
  }
}
