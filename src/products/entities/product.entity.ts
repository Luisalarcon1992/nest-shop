/*
Una Entidad es una relación de una tabla en una base de datos, en este caso, la entidad Product es una relación de la tabla products en la base de datos.
Para crear una entidad se debe usar el decorador @Entity y se debe pasar un objeto con la propiedad name que es el nombre de la tabla en la base de datos.

*/

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImages } from "./";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: "products",
})
export class Product {
  @ApiProperty({
    example: "1f4d1c1c-7d0c-4f4e-a6b3-8a8b8e3f4b1d",
    description: "Identificador único del producto",
    type: "UUID V4",
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: "Camiseta Estampada",
    description: "Nombre del producto",
    type: "string",
  })
  @Column("text", {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: "10.5",
    description: "Precio del producto",
    type: "number",
    default: 0,
  })
  @Column("float", {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: "Camiseta de algodón",
    description: "Descripción del producto",
    type: "string",
  })
  @Column({
    type: "text",
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: "camiseta_estampada",
    description: "Slug del producto",
    type: "string",
  })
  @Column("text", { unique: true })
  slug: string;

  @ApiProperty({
    example: "5",
    description: "Cantidad en stock del producto",
    type: "number",
    default: 0,
  })
  @Column("int", {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: "['S', 'M', 'L']",
    description: "Tallas disponibles del producto",
    type: "array",
    items: {
      type: "string",
    },
  })
  @Column("text", {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: "Hombre",
    description: "Género del producto",
    type: "string",
  })
  @Column("text")
  gender: string;

  @ApiProperty({
    example: "['camiseta', 'estampada']",
    description: "Tags del producto",
    type: "array",
    items: {
      type: "string",
    },
  })
  @Column("text", {
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => ProductImages, productImages => productImages.product, { cascade: true, eager: true })
  images?: ProductImages[];

  @ManyToOne(() => User, user => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlug() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug.toLowerCase().trim().replaceAll(" ", "-").replaceAll("'", "");
  }

  @BeforeUpdate()
  checkSlugBeforeUpdate() {
    this.slug = this.slug.toLowerCase().trim().replaceAll(" ", "-").replaceAll("'", "");
  }
}
