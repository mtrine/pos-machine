import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/requestDTO/create-product.dto';
import { UpdateProductDto } from './dto/requestDTO/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, set } from 'mongoose';
import { Product } from './schemas/product.schema';
import { Category } from '../categories/schemas/category.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    private cloudinaryService: CloudinaryService
  ) { }
  async create(file: Express.Multer.File, createProductDto: CreateProductDto) {
    const category = await this.categoryModel.findById(createProductDto.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Upload ảnh lên Cloudinary
    const uploadResult = await this.cloudinaryService.uploadFile(file, 'products');

    // Tạo sản phẩm mới
    const newProduct = await this.productModel.create({
      ...createProductDto,
      category: { _id: category._id, name: category.name },
      imageUrl: uploadResult.secure_url,  // Sử dụng URL ảnh từ Cloudinary
    });

    return newProduct;
  }

  async findAll() {
    return await this.productModel.find();;
  }

  async update(productId: string, file: Express.Multer.File, updateProductDto: UpdateProductDto) {
    // Tìm sản phẩm theo ID
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Kiểm tra danh mục (nếu categoryId được cập nhật)
    const category = await this.categoryModel.findById(updateProductDto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }



    // Nếu có file ảnh mới, upload lên Cloudinary
    if (file) {
      // Upload ảnh mới
      const uploadResult = await this.cloudinaryService.uploadFile(file, 'products');

      // Xóa ảnh cũ khỏi Cloudinary (nếu cần)
      if (product.imageUrl) {
        const publicId = this.extractPublicIdFromUrl(product.imageUrl);
        await this.cloudinaryService.deleteFile(publicId,"products");
      }

      // Gán URL ảnh mới
      updateProductDto.imageUrl = uploadResult.secure_url;
    }

    // Cập nhật sản phẩm
    const updateCategory = await this.productModel.findByIdAndUpdate(productId, {
      ...updateProductDto,
      category: { _id: category._id, name: category.name },
      updatedAt: new Date(),
    },{new:true});

    return updateCategory;
  }

  private extractPublicIdFromUrl(url: string): string {
    // Trích xuất public_id từ URL của Cloudinary
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.split('.')[0]; // Loại bỏ phần mở rộng (ví dụ: .jpg, .png)
  }

  async remove(id: string) {
    const deleteProduct = await this.productModel.findByIdAndDelete(id);
    if(!deleteProduct){
      throw new NotFoundException('Product not found');
    }
    if(deleteProduct.imageUrl){
      setTimeout(async () => {
        const publicId = this.extractPublicIdFromUrl(deleteProduct.imageUrl);
        this.cloudinaryService.deleteFile(publicId,"products");
      })
    }
    return deleteProduct;
  }
}
