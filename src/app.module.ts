import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { CoffeeRatingModule } from './modules/coffee-rating/coffee-rating.module';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import appConfig from './config/app.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'postgres',
                database: process.env.DATABASE_NAME,
                host: process.env.DATABASE_HOST,
                port: +process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                autoLoadEntities: true,
                synchronize:
                    process.env.NODE_ENV === 'production' ? false : true, // Note: Don't use on Prod
            }),
        }),
        CoffeesModule,
        CoffeeRatingModule,
        DatabaseModule,
        CommonModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
