import { CoffeesModule } from './../../src/modules/coffees/coffees.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('[Feature] Coffees - /coffees', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                CoffeesModule,
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: 'postgres',
                        database: 'postgres',
                        host: 'localhost',
                        port: 5433,
                        username: 'postgres',
                        password: 'pass123',
                        autoLoadEntities: true,
                        synchronize: true,
                    }),
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it.todo('Create [POST /]');
    it.todo('Get all [GET /]');
    it.todo('Get one [GET /:id]');
    it.todo('Update one [PATCH /:id');
    it.todo('Delete one [DELETE /:id]');

    afterAll(async () => {
        await app.close();
    });
});
