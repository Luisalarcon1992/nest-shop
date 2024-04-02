import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import * as uuid from "uuid";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;

    const product = await this.productRepository.find({
      skip: offset,
      take: limit,
    });

    return product;
  }

  async findOne(id: string) {
    let product: Product;

    if (uuid.validate(id)) {
      product = await this.productRepository.findOneBy({ id });
    } else {
      // product = await this.productRepository.findOneBy({ slug: id }); Si se quisiera buscar por slug o cualquier otro campo

      const queryBuilder = this.productRepository.createQueryBuilder();
      // ILIKE es un operador de comparación que actúa como =, pero no distingue entre mayúsculas y minúsculas.
      // % es un comodín que representa cero o más caracteres. Además, se utiliza para buscar cualquier cadena que contenga el valor especificado.
      product = await queryBuilder.where("title ILIKE :title or slug ILIKE :slug", { title: `%${id}%`, slug: `%${id}%` }).getOne();

      return product;
    }

    if (!product) throw new NotFoundException("Producto no encontrado");

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) throw new NotFoundException(`Producto no encontrado con el id ${id}`);

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
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
}
