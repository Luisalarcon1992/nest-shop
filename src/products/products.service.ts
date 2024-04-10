import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import * as uuid from "uuid";
import { ProductImages } from "./entities";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImages)
    private readonly productImagesRepository: Repository<ProductImages>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productsDetails } = createProductDto;

      const product = this.productRepository.create({ ...productsDetails, images: images.map(url => this.productImagesRepository.create({ url: [url] })) });
      await this.productRepository.save(product);

      return { ...product, user, images };
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;

    const product = await this.productRepository.find({
      skip: offset,
      take: limit,
      relations: {
        images: true,
      },
    });

    return product;
  }

  async findOne(id: string) {
    let product: Product;

    if (uuid.validate(id)) {
      product = await this.productRepository.findOneBy({ id });
    } else {
      // product = await this.productRepository.findOneBy({ slug: id }); Si se quisiera buscar por slug o cualquier otro campo

      const queryBuilder = this.productRepository.createQueryBuilder("prod");
      // ILIKE es un operador de comparación que actúa como =, pero no distingue entre mayúsculas y minúsculas.
      // % es un comodín que representa cero o más caracteres. Además, se utiliza para buscar cualquier cadena que contenga el valor especificado.
      product = await queryBuilder
        .where("title ILIKE :title or slug ILIKE :slug", { title: `%${id}%`, slug: `%${id}%` })
        .leftJoinAndSelect("prod.images", "prodImages")
        .getOne();

      return product;
    }

    if (!product) throw new NotFoundException("Producto no encontrado");

    return product;
  }

  // Este método es similar al anterior, pero en lugar de devolver la entidad completa, devuelve solo los campos que se le indiquen.
  // Es decir, no devolverá el id de la imagen, sino solo la url.
  // Si por alguna razón se necesita devolver el objeto completo, se puede hacer con el método findOne.
  async findOnePlain(id: string) {
    const { images = [], ...rest } = await this.findOne(id);

    return { ...rest, images: images.map(({ url }) => url) };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product) throw new NotFoundException(`Producto no encontrado con el id ${id}`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Con este if borramos las imágenes anteriores ya sea porque se quieren actualizar o porque se quieren eliminar.
      if (images) {
        await queryRunner.manager.delete(ProductImages, { product: { id } });

        // Acá se crean las nuevas imágenes, si es que se enviaron. Todavía no se guardan en la base de datos.
        product.images = images.map(url => this.productImagesRepository.create({ url: [url] }));
      }

      product.user = user;

      await queryRunner.manager.save(product);

      // await this.productRepository.save(product);

      // Realizamos el commit de la transacción, es decir, guardamos los cambios en la base de datos.
      await queryRunner.commitTransaction();

      // Liberamos el queryRunner para que pueda ser utilizado por otros servicios.
      await queryRunner.release();
      return this.findOne(id);
    } catch (error) {
      // Si ocurre un error, hacemos un rollback de la transacción, es decir, deshacemos los cambios realizados.
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDbException(error);
    }
  }

  async remove(id: string) {
    /* Hay dos formas de eliminar entidades en TypeORM: delete y remove.
    delete se utiliza para eliminar múltiples entidades basadas en un criterio de filtrado esto es útil cuando se desea eliminar varias entidades a la vez, 
    mientras que remove se utiliza para eliminar una entidad específica que ya está cargada en la memoria.
    */
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  handleDbException(error: any) {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }
    if (error.code === "22P02") {
      throw new BadRequestException("El precio y el stock deben ser números");
    }

    if (error.code === "23502") {
      throw new BadRequestException(`El campo ${error.column} es obligatorio`);
    }
    console.log(error);
    this.logger.error(error);
    throw new InternalServerErrorException("Error inesperado - Revisar los logs");
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder("product");

    try {
      // Se puede utilizar el método delete de TypeORM para eliminar todas las entidades de una tabla.
      // El método delete no requiere un where, pero se puede agregar uno si se desea eliminar solo un subconjunto de entidades.
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDbException(error);
    }
  }
}
