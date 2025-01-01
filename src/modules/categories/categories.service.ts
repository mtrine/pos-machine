import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/requestDTO/create-category.dto';
import { UpdateCategoryDto } from './dto/requestDTO/update-category.dto';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CustomException } from 'src/exception-handler/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';


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
    const category = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto);
    if(
      !category
    ){
      throw new CustomException(ErrorCode.NOT_FOUND);
    }
    return category ;
  }

  async remove(id: string) {
    return await this.categoryModel.findByIdAndDelete(id); 
  }
}
