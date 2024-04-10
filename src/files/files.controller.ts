import { BadRequestException, Controller, FileTypeValidator, Get, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { fileNamer } from "./helpers/fileNamer.helper";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "src/auth/decorators";
import { ValidRoles } from "src/auth/interfaces/valid-roles";
import { FileResponseGet, FileResponsePost } from "./decorators/file-response.decorator";

@ApiTags("Files")
@Controller("files")
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  // Al usar el decorador @Res nest deja de tener control sobre la respuesta y se debe retornar un valor
  // Es decir, nosotros en lugar del return path; debemos retornar res
  @Get("product/:imagename")
  @FileResponseGet()
  findProductImage(@Res() res: Response, @Param("imagename") imageName: string) {
    console.log({ imageName });
    const path = this.filesService.getImage(imageName);

    res.status(200).sendFile(path);
  }

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 1024 * 1024 * 2, // 2MB
      },
      /* Esto sirve para enviar archivos estáticos, es decir, si en algún momento necesitamos servir alguna imágen que siempre será la misma, se podría utilizar este método
      Por otro lado, no tenemos control sobre quién puede acceder a la imagen, por lo que no es recomendable utilizarlo para archivos sensibles
      En el path http://localhost:3000/api/files/product/1473809-00-A_1_2000.jpg se puede acceder a la imagen, pero no se puede controlar quién puede acceder a ella
      se tiene que agregar el prefijo files en el path para que funcione
      */
      storage: diskStorage({ destination: "./static/products", filename: fileNamer }),
    }),
  )
  @FileResponsePost()
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /image\/(jpeg|jpg|png|bmp|webp|svg)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException("El archivo es requerido");

    const secureUrl = `${this.configService.get("HOST_API")}/files/products/${file.filename}`;
    return { secureUrl };
  }
}
