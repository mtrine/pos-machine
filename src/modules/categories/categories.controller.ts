import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/requestDTO/create-category.dto';
import { UpdateCategoryDto } from './dto/requestDTO/update-category.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Serialize } from 'src/decorators/serialize.decorator';
import { CategoryResponseDTO } from './dto/responseDTO/response-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ResponseMessage('Category created successfully')
  @Serialize(CategoryResponseDTO)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ResponseMessage('Category list fetched successfully')
  @Serialize(CategoryResponseDTO)
  async findAll() {
    return await this.categoriesService.findAll();
  }


  @Patch(':id')
  @ResponseMessage('Category updated successfully')
  @Serialize(CategoryResponseDTO)
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ResponseMessage('Category deleted successfully')
  @Serialize(CategoryResponseDTO)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
