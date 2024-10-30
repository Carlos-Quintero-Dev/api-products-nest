import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ManagerError } from 'src/common/errors/manage.error';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { ResponseAllCategories } from './interfaces/products/interfaces/response-categories.interface';

@Injectable()
export class CategoriesService {

  private Category: CategoryEntity[] = []

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category: CategoryEntity = {
        ...createCategoryDto,
        isActive: true,
        id: this.Category.length + 1,
      };
      if (!category) {
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'Category is not created!',
        });
      }

      this.Category.push(category);

      return category;

    } catch (error) {
      throw new ManagerError({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'OCURRIO UN ERROR INESPERADO',
      });
    }
  }

  async findAll( paginationDto: PaginationDto):Promise< ResponseAllCategories >  {
    try {
      if( this.Category.length === 0 ){
      throw new ManagerError({
        type: "NOT_FOUND",
        message: "Categories not found!"
      });
    }
  
    const { page, limit } = paginationDto;
    const total = this.Category.filter((category) => category.isActive === true).length

    const skip = ( page - 1 ) * limit;

    const lastPage = Math.ceil(total / limit);
    
    const data = this.Category.slice( skip, limit );

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

  findOne(id: number) {
    try {
      const foundCategory = this.Category.filter((category) => category.id === id && category.isActive === true)
      if (!foundCategory) {
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Category not found!"
      })
    }

    return foundCategory
    } catch (error) {
      throw new ManagerError({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'OCURRIO UN ERROR INESPERADO',
      });
    }


}

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try { 
      let categoryDB = this.Category.find(category => category.id === id)

      if (!categoryDB) {
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Category not found!"
      })
    }
      
      this.Category = this.Category.map(category => {
        if(category.id === id){
          categoryDB = {
            ...categoryDB,
            ...updateCategoryDto
          }
          return categoryDB
        }
        return category;
      })
  }
  catch (error){
    throw new ManagerError({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'OCURRIO UN ERROR INESPERADO',
      });
  }
}

  remove(id: number) {
    try{
      const index = this.Category.findIndex(category => category.id === id);
    
      if (index === -1) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'category not found'
        })
      }
  
      this.Category[index]={
        ...this.Category[index],
        isActive:  false
      };

      this.Category.splice(index, 1);
      
      return {
        message: `Category with ID ${id} has been deleted`,
        remainingCategoria: this.Category.length
      };

    } catch(error){
      ManagerError.createSignatureError(error.message)
    }
  }
}
