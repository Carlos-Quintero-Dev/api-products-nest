import { CategoryEntity } from "src/categories/entities/category.entity";

export interface ResponseAllCategories{
    page: number;
    lastPage: number;
    total: number;
    limit: number;
    data: CategoryEntity[];
}