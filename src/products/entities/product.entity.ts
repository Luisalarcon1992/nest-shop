/*
Una Entidad es una relación de una tabla en una base de datos, en este caso, la entidad Product es una relación de la tabla products en la base de datos.
Para crear una entidad se debe usar el decorador @Entity y se debe pasar un objeto con la propiedad name que es el nombre de la tabla en la base de datos.

*/

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImages } from "./";
import { User } from "src/auth/entities/user.entity";

@Entity({
  name: "products",
})
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", {
    unique: true,
  })
  title: string;

  @Column("float", {
    default: 0,
  })
  price: number;

  @Column({
    type: "text",
    nullable: true,
  })
  description: string;

  @Column("text", { unique: true })
  slug: string;

  @Column("int", {
    default: 0,
  })
  stock: number;

  @Column("text", {
    array: true,
  })
  sizes: string[];

  @Column("text")
  gender: string;

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
