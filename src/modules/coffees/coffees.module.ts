import { CoffeesController } from './controllers/coffees.controller';
import { CoffeesService } from './services/coffees.service';
import { Module } from '@nestjs/common';

@Module({ controllers: [CoffeesController], providers: [CoffeesService] })
export class CoffeesModule {}
