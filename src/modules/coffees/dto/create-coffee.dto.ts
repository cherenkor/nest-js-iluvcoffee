import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCoffeeDto {
    @ApiProperty({
        description: 'The name of the coffee',
    })
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'The description of the coffee',
    })
    @IsString()
    @IsOptional()
    readonly description: string;

    @ApiProperty({
        description: 'The brand of the coffee',
    })
    @IsString()
    readonly brand: string;

    @ApiProperty({
        description: 'The flavors of the coffee',
        example: [],
    })
    @IsString({ each: true })
    readonly flavors: string[];
}
