import { Flavor } from './entities/flavor.entity';
import { CoffeesController } from './controllers/coffees.controller';
import { CoffeesService } from './services/coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor])],
    controllers: [CoffeesController],
    providers: [CoffeesService],
})
export class CoffeesModule {}
