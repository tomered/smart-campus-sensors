import { Entity, Column, BaseEntity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sensors } from './sensors';



// Sensors' location on campus table
@Entity('location')
export class Location extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @OneToOne(() => Sensors, (sensor) => sensor.location) // Use the `location` property in Sensors
    sensor!: Sensors;

    @Column('float')
    x!: number;

    @Column('float')
    y!: number;
    
    @Column('text', { array: true })
    room!: string[];

    @Column('text', { array: true })
    near!: string[];
}
