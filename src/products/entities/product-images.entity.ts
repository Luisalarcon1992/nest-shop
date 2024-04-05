import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from ".";

@Entity({
  name: "products_images",
})
export class ProductImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", {
    array: true,
  })
  url: string[];

  @ManyToOne(() => Product, product => product.images, { onDelete: "CASCADE" })
  product: Product;
}
