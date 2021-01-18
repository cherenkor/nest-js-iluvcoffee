import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { CoffeeRatingModule } from './modules/coffee-rating/coffee-rating.module';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            database: process.env.DATABASE_NAME,
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
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
