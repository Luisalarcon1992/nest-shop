import { BadRequestException, Controller, FileTypeValidator, Get, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { fileNamer } from "./helpers/fileNamer.helper";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Controller("files")
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  // Al usar el decorador @Res nest deja de tener control sobre la respuesta y se debe retornar un valor
  // Es decir, nosotros en lugar del return path; debemos retornar res
  @Get("products/:imagename")
  findProductImage(@Res() res: Response, @Param("imagename") imageName: string) {
    console.log({ imageName });
    const path = this.filesService.getImage(imageName);

    res.status(200).sendFile(path);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 1024 * 1024 * 2, // 2MB
      },
      storage: diskStorage({ destination: "./static/products", filename: fileNamer }),
    }),
  )
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
