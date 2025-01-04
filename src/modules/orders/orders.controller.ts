import { Controller, Get, Param, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { ResponseMessage } from "src/decorators/response-message.decorator";
import { Serialize } from "src/decorators/serialize.decorator";
import { OrderResponseDTO } from "./dto/responseDTO/response-order.dto";

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
    ) { }

    @Get()
    @ResponseMessage('Orders retrieved successfully')
    @Serialize(OrderResponseDTO)
    async findAll(@Query('limit') limit?: number, @Query('page') page?: number) {
        return await this.ordersService.findAll(limit, page);
    }

    @Get(':id')
    @ResponseMessage('Order retrieved successfully')
    @Serialize(OrderResponseDTO)
    async findOne(@Param('id') id: string) {
        return await this.ordersService.findOne(id);
    }

}