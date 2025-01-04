import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/requestDTO/create-product.dto';
import { UpdateProductDto } from './dto/requestDTO/update-product.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Serialize } from 'src/decorators/serialize.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductResponseDTO } from './dto/responseDTO/response-product.dto';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ResponseMessage('Product created successfully')
  @Serialize(ProductResponseDTO)
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File,@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(file,createProductDto);
  }

  @Get()
  @ResponseMessage('Product list fetched successfully')
  @Serialize(ProductResponseDTO)
  async findAll() {
    return await this.productsService.findAll();
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Product updated successfully')
  @Serialize(ProductResponseDTO)
  async update(@UploadedFile() file: Express.Multer.File,@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(id, file, updateProductDto);
  }

  @Delete(':id')
  @ResponseMessage('Product deleted successfully')
  @Serialize(ProductResponseDTO)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
