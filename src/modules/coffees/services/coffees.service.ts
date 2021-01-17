import { CreateCoffeeDto } from './../dto/create-coffee.dto';
import { UpdateCoffeeDto } from './../dto/update-coffee.dto';
import { Coffee } from '../entities/coffee.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [
        {
            id: '1',
            name: 'Shipwrek Roast',
            brand: 'Buddy Brew',
            flavors: ['chocolatte', 'vanilla'],
        },
    ];

    findAll(): Coffee[] {
        return this.coffees;
    }

    findOne(id: string): Coffee {
        const coffee = this.coffees.find((item) => item.id === id);

        if (coffee) return coffee;

        throw new NotFoundException(`Coffee with id ${id} was not found`);
    }

    create(createCoffeeDto: CreateCoffeeDto): Coffee {
        this.coffees.push(createCoffeeDto as Coffee);

        return createCoffeeDto as Coffee;
    }

    update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const coffee = this.findOne(id);

        if (coffee) {
            // update
        }
    }

    remove(id: string): Coffee {
        const indexToDelete = this.coffees.findIndex((item) => item.id === id);

        if (indexToDelete === -1) return;

        return this.coffees.splice(indexToDelete, 1)[0];
    }
}
