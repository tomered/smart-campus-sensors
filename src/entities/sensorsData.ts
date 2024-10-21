import { Entity, Column, BaseEntity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sensors } from './sensors';

// Sensors' past data

@Entity('sensorsData')
export class SensorsData extends BaseEntity {

    @Column()
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @ManyToOne(() => Sensors, (sensor) => sensor.sensors_data)
    sensor!: Sensors;

    @Column('text', { array: true })
    data!: string[];

    @Column()
    last_update!: Date;

}