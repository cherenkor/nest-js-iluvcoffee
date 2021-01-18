import { DEFAULT_MAX_PAGINATION } from './../../../constants/limits';
import { Flavor } from './../entities/flavor.entity';
import { CreateCoffeeDto } from './../dto/create-coffee.dto';
import { UpdateCoffeeDto } from './../dto/update-coffee.dto';
import { Coffee } from '../entities/coffee.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
    ) {}

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

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const flavor = await this.flavorRepository.findOne({ name });

        if (flavor) return flavor;

        return this.flavorRepository.create({ name });
    }
}
