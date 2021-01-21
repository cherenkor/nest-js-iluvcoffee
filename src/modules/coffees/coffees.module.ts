import { Coffee, CoffeeSchema } from './entities/coffee.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CoffeesController } from './controllers/coffees.controller';
import { CoffeesService } from './services/coffees.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Coffee.name,
                schema: CoffeeSchema,
            },
        ]),
    ],
    controllers: [CoffeesController],
    providers: [CoffeesService],
})
export class CoffeesModule {}
