import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';

// recordemos que a esto lo llama otro microservicio no un frontend o algo asi
export class UpdateProductoDto extends PartialType(CreateProductoDto) {
}
