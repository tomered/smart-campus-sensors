import {
  Entity,
  Column,
  BaseEntity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { SensorsData } from "./sensorsData";
import { Location } from "./location";

// Sensors info table
@Entity("sensors")
export class Sensors extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column('text', { array: true })
  type!: string[];

  @Column()
  date_created!: Date;

  // This will reference the Location entity
  @OneToOne(() => Location)
  @JoinColumn() // Automatically maps to location_id in the location table
  location!: Location; // Changed from location_id to location

  @OneToMany(() => SensorsData, (sensorsData) => sensorsData.sensor, { cascade: true })
  sensors_data!: SensorsData[]; // Changed from Location to SensorsData[]
}
