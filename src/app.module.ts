import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { CoffeeRatingModule } from './modules/coffee-rating/coffee-rating.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'pass123',
            database: 'postgres',
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV === 'production' ? false : true, // Note: Don't use on Prod
        }),
        CoffeesModule,
        CoffeeRatingModule,
        DatabaseModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
