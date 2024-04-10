import { PartialType } from "@nestjs/swagger";
// import { PartialType } from '@nestjs/mapped-types'; este es el orginal, pero en swagger es lo mismo y sirve para la documentación de la api
import { CreateProductDto } from "./create-product.dto";

export class UpdateProductDto extends PartialType(CreateProductDto) {}
