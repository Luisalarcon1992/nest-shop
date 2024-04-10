import { Controller, Get } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { ApiTags } from "@nestjs/swagger";
import { SeedResponse } from "./decorators/seed-response.decorator";

@ApiTags("Seed")
@Controller("seed")
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @SeedResponse()
  seed() {
    return this.seedService.seed();
  }
}
