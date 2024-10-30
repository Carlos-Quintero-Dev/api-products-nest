import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';
import { ResponseAllProducts } from './interfaces/response-products.interface';
import { ManagerError } from 'src/common/errors/manage.error';
import { CategoriesService } from 'src/categories/categories.service';


@Injectable()
export class ProductsService {

  constructor (private readonly categoriesService: CategoriesService){}

  private product: ProductEntity[] = []
  async create(createProductDto: CreateProductDto) {
    try {
      const product: ProductEntity = {
        ...createProductDto,
        isActive: true,
        id: this.product.length+1,
      }
      if (!product) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'product is not created!',
        });
      }
  
      this.product.push(product); 
      return product
    } catch (error) {
      throw new ManagerError({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'OCURRIO UN ERROR INESPERADO',
      });
    }
  }

  async findAll( paginationDto: PaginationDto):Promise< ResponseAllProducts > {
    try {

      if( this.product.length === 0 ){
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Product not found!"
        });
      }
    
      const { page, limit } = paginationDto;
      const total = this.product.filter((product) => product.isActive === true).length

      const skip = ( page - 1 ) * limit;

      const lastPage = Math.ceil(total / limit);
      
      const data = this.product.slice( skip, limit );

      return {
        page,
        lastPage,
        total,
        limit,
        data
      }
      
    } catch (error) {
      throw new ManagerError({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'OCURRIO UN ERROR INESPERADO',
      });
    }
  }

  async findOne(id: number) {
    try{

      const product = this.product.find(product => product.id === id && product.isActive === true)
      if (!product) {
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "product not found!"
      })
    }

    const category = this.categoriesService.findOne(product.categoryId)

      return{
        product,
        category
      };

    }catch(error){
      throw new ManagerError({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'OCURRIO UN ERROR INESPERADO',
      });
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try { 
      let productDB = this.product.find(product => product.id === id)

      if (!productDB) {
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "product not found!"
      })
    }
      
      this.product = this.product.map(product => {
        if(product.id === id){
          productDB = {
            ...productDB,
            ...updateProductDto
          }
          return productDB
        }
        return product;
      })
  }
  catch{
    throw new ManagerError({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'OCURRIO UN ERROR INESPERADO',
      });
  }
}

  delete(id: number) {
    try{
      const index = this.product.findIndex(product => product.id === id);
    
      if (index === -1) {
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Product not found!"
      })
    }
  
      this.product.splice(index, 1);
      
      return {
        message: `Product with ID ${id} has been deleted`,
        remainingProducts: this.product.length
      };

    } catch(error){
    throw new ManagerError({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'OCURRIO UN ERROR INESPERADO',
      });
    }
  }
}
