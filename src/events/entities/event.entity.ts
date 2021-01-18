import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Index()
    @Column()
    name: string;

    @Column('json')
    payload: Record<string, any>;
}
