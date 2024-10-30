import { ProductEntity } from "../entities/product.entity";

export interface ResponseAllProducts{
    page: number;
    lastPage: number;
    total: number;
    limit: number;
    data: ProductEntity[];
}