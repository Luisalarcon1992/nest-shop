import { Injectable, NotFoundException } from "@nestjs/common";
import { existsSync } from "fs";
import { join } from "path";

@Injectable()
export class FilesService {
  getImage(imageName: string) {
    const path = join(__dirname, `../../static/products/${imageName}`);
    console.log({ path });

    if (!existsSync(path)) throw new NotFoundException(`La imagen con el nombre ${imageName} no existe`);

    return path;
  }
}
