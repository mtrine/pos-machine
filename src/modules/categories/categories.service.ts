import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/requestDTO/create-category.dto';
import { UpdateCategoryDto } from './dto/requestDTO/update-category.dto';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    // private configService: ConfigService
  ) { }
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryModel.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryModel.find();
  }


  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto);
  }

  async remove(id: string) {
    return await this.categoryModel.findByIdAndDelete(id); 
  }
}
