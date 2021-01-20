import { Event } from '../../events/entities/event.entity';
import { Flavor } from './entities/flavor.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
        @Inject(coffeesConfig.KEY)
        private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
    ) {
        console.log(this.coffeesConfiguration.database.port);
    }

    findAll({ limit, offset }: PaginationQueryDto): Promise<Coffee[]> {
        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: string): Promise<Coffee> | never {
        const coffee = await this.coffeeRepository.findOne(id, {
            relations: ['flavors'],
        });

        if (!coffee)
            throw new NotFoundException(`Coffee with id ${id} was not found`);

        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map((name) =>
                this.preloadFlavorByName(name),
            ),
        );

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        });

        return this.coffeeRepository.save(coffee);
    }

    async update(
        id: string,
        updateCoffeeDto: UpdateCoffeeDto,
    ): Promise<Coffee> {
        const flavors =
            updateCoffeeDto.flavors.length &&
            (await Promise.all(
                updateCoffeeDto.flavors.map((name) =>
                    this.preloadFlavorByName(name),
                ),
            ));

        const coffee = await this.coffeeRepository.preload({
            id,
            ...updateCoffeeDto,
            flavors,
        });

        if (!coffee)
            throw new NotFoundException(`Coffee with id ${id} was not found`);

        return this.coffeeRepository.save(coffee);
    }

    async remove(id: string): Promise<Coffee> {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    async recommendCoffee(coffee: Coffee): Promise<void> {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            coffee.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffee: coffee.id };

            await queryRunner.manager.save(recommendEvent);
            await queryRunner.manager.save(coffee);

            await queryRunner.commitTransaction();
        } catch (ex) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const flavor = await this.flavorRepository.findOne({ name });

        if (flavor) return flavor;

        return this.flavorRepository.create({ name });
    }
}
