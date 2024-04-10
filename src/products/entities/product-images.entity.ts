import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from ".";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: "products_images",
})
export class ProductImages {
  @ApiProperty({
    example: "1",
    description: "Identificador único de la imagen del producto",
    type: "number",
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "['url1', 'url2']",
    description: "URL de la imagen del producto",
    type: "array",
    items: {
      type: "string",
    },
  })
  @Column("text", {
    array: true,
  })
  url: string[];

  @ManyToOne(() => Product, product => product.images, { onDelete: "CASCADE" })
  product: Product;
}
