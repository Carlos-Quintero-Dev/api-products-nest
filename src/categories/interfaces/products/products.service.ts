import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ManagerError } from 'src/common/errors/manage.error';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { ResponseAllProducts } from 'src/products/interfaces/response-products.interface';
import { ProductEntity } from './entities/product.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {

  constructor(private readonly categoriesService: CategoriesService){}

  private product: ProductEntity[] = []
  create(createProductDto: CreateProductDto) {
    try {
      const product: ProductEntity = {
        ...createProductDto,
        isActive: true,
        id: this.product.length + 1,
        categoryId: 0
      }
      if( !product ){
        throw new BadRequestException("Product not create!");
      }
  
      this.product.push(product); 
      return product
    } catch (error) {
      throw new InternalServerErrorException("500 Server Error");
    }
  }

  async findAll( paginationDto: PaginationDto):Promise< ResponseAllProducts > {
    try {

      if( this.product.length === 0 ){
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Products not found!"
        });
      }
    
      const { page, limit } = paginationDto;
      const total = this.product.filter((product) => product.isActive===true).length

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
      ManagerError.createSignatureError( error.message )
    }
  }

  findOne(id: number) {
    try{

      const product = this.product.find(product => product.id === id && product.isActive === true)
      if(!product) throw new NotFoundException('Product not found')

        const category = this.categoriesService.findOne(product.categoryId)

      return product && category;
    }catch(error){
      throw new InternalServerErrorException('500 Server Error')
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try { 
      let productDB = this.product.find(product => product.id === id)
      
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
    throw new InternalServerErrorException('500 Server Error')
  }
}

  delete(id: number) {
    try {
      const productDB = this.product.find(product => product.id === id)
      if(!productDB) throw new NotFoundException('Product not found')
      this.product = this.product.filter(product => product.id !== id)

      return 'Producto Eliminad'
    } catch (error) {
      throw new InternalServerErrorException('500 Server Error')
    }
  }
}
