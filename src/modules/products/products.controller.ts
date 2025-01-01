import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/requestDTO/create-product.dto';
import { UpdateProductDto } from './dto/requestDTO/update-product.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Serialize } from 'src/decorators/serialize.decorator';
import { ResponseProductDto } from './dto/responseDTO/response-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ResponseMessage('Product created successfully')
  @Serialize(ResponseProductDto)
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File,@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(file,createProductDto);
  }

  @Get()
  @ResponseMessage('Product list fetched successfully')
  @Serialize(ResponseProductDto)
  async findAll() {
    return await this.productsService.findAll();
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Product updated successfully')
  @Serialize(ResponseProductDto)
  async update(@UploadedFile() file: Express.Multer.File,@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(id, file, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
