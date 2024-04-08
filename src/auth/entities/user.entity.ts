import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { unique: true })
  email: string;

  @Column(
    "text",
    { select: false }, // no queremos que se seleccione por defecto en las consultas
  )
  password: string;

  @Column("text")
  fullName: string;

  @Column("bool", { default: true })
  isActive: boolean; // la idea es no eliminar usuarios, sino desactivarlos, así no perdemos la información de las relaciones

  @Column("text", {
    array: true,
    default: ["user"],
  })
  roles: string[]; // roles del usuario, por ejemplo: ['admin', 'customer']

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
