import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Sensors } from "../entities/sensors";
import { SensorsData } from "../entities/sensorsData";
import { Location } from "../entities/location";

dotenv.config();

export const dataSource = new DataSource({
  type: "postgres",
  username: process.env.SDB_USERNAME,
  password: process.env.SDB_PASSWORD,
  host: process.env.SDB_HOST,
  port: 5432,
  database: process.env.SDB,
  schema: process.env.SSCHEMA,
  entities: [Sensors, SensorsData, Location],
  synchronize: true,
  ssl: false,

});

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generating random data for the sensors
 */
export const generateRandomData = async () => {

  try {
    const sensorsRepository = dataSource.getRepository(Sensors)

    const randomSensor = await sensorsRepository.createQueryBuilder('sensor')
      .orderBy('RANDOM()')
      .getOne()

    if (randomSensor) {
      const data: string[] = []
      randomSensor.type.map(type => {
        switch (type) {
          case ('Temperature'):
            const temp = randomInteger(10, 50) + '°C'
            data.push(temp)
            break;
          case ('Pressure'):
            const pascals = randomInteger(0, 101325) + 'Pa'
            data.push(pascals)

            break;
          case ('Humidity'):
            const percentage = randomInteger(0, 100) + '%'
            data.push(percentage)

            break;
          case ('Light'):
            let isLight: string;
            if (randomInteger(0, 50) % 2 === 0) {
              isLight = 'true'
            } else {
              isLight = 'false'
            }

            data.push(isLight)

            break;
          case ('AC'):
            let isACOn: string;
            if (randomInteger(0, 50) % 2 === 0) {
              isACOn = 'true'
            } else {
              isACOn = 'false'
            }

            data.push(isACOn)

            break;
          case ('Movement'):
            let isMove: string;
            if (randomInteger(0, 50) % 2 === 0) {
              isMove = 'true'
            } else {
              isMove = 'false'
            }

            data.push(isMove)
            break;
          case ('CO2'):
            const ppm = randomInteger(400, 2000) + 'ppm'
            data.push(ppm)

            break;

        }

      })


      const sensorsData = SensorsData.create({
        data: data,
        last_update: new Date(),
        sensor: randomSensor,
      })

      await SensorsData.save(sensorsData);

    }

  } catch (error) {
    console.error("Error fetching random sensor:", error);
  }
}

/**
 * Mock data with sensors nad their locations (should run only once when db is empty to avoid duplications)
 */
export const mockData = async () => {
  // Create sensor locations
  const locations: Location[] = [
    Location.create({
      x: 1.23,
      y: 4.56,
      room: ['111_1', 'outdoors'],
      near: ['under_window', 'left_door'],
    }),
    Location.create({
      x: 7.89,
      y: 0.12,
      room: ['305_8', 'indoors'],
      near: ['above_door'],
    }),
    Location.create({
      x: 3.45,
      y: 6.78,
      room: ['105_3', 'indoors'],
      near: ['under_window'],
    }),
    Location.create({
      x: 9.01,
      y: 2.34,
      room: ['205_5', 'indoors'],
      near: ['under_ac', 'top_right_corner'],
    }),
    Location.create({
      x: 5.67,
      y: 8.90,
      room: ['101_2', 'outdoors'],
      near: ['left_door', 'under_sun'],
    }),
    Location.create({
      x: 2.34,
      y: 1.23,
      room: ['212_5', 'indoors'],
      near: ['beside_window', 'right_corner'],
    }),
    Location.create({
      x: 6.54,
      y: 3.21,
      room: ['110_8', 'indoors'],
      near: ['near_heater', 'center_of_room'],
    }),
    Location.create({
      x: 4.56,
      y: 7.89,
      room: ['308_8', 'indoors'],
      near: ['beside_ac', 'right_door'],
    }),
    Location.create({
      x: 8.12,
      y: 1.45,
      room: ['120_5', 'outdoors'],
      near: ['top_right_window'],
    }),
    Location.create({
      x: 2.89,
      y: 5.67,
      room: ['305_1', 'indoors'],
      near: ['under_light', 'right_corner'],
    }),
    Location.create({
      x: 5.56,
      y: 8.89,
      room: ['308_8', 'indoors'],
      near: ['under_window'],
    }),
  ];

  // Save locations to the database
  const savedLocations = await Location.save(locations);

  // Create sensors and associate them with locations
  const sensors: Sensors[] = [
    Sensors.create({
      type: ['Temperature', 'Humidity'],
      date_created: new Date(),
      location: savedLocations[0], // Associate with location
    }),
    Sensors.create({
      type: ['Movement', 'Light'],
      date_created: new Date(),
      location: savedLocations[1], // Associate with location
    }),
    Sensors.create({
      type: ['CO2', 'Pressure'],
      date_created: new Date(),
      location: savedLocations[2], // Associate with location
    }),
    Sensors.create({
      type: ['Movement', 'Temperature','Pressure'],
      date_created: new Date(),
      location: savedLocations[3], // Associate with location
    }),
    Sensors.create({
      type: ['CO2', 'Humidity'],
      date_created: new Date(),
      location: savedLocations[4], // Associate with location
    }),
    Sensors.create({
      type: ['Pressure', 'Temperature'],
      date_created: new Date(),
      location: savedLocations[5], // Associate with location
    }),
    Sensors.create({
      type: ['Light', 'AC'],
      date_created: new Date(),
      location: savedLocations[6], // Associate with location
    }),
    Sensors.create({
      type: ['Movement', 'Temperature','Light'],
      date_created: new Date(),
      location: savedLocations[7], // Associate with location
    }),
    Sensors.create({
      type: ['CO2', 'Humidity'],
      date_created: new Date(),
      location: savedLocations[8], // Associate with location
    }),
    Sensors.create({
      type: ['Humidity', 'Pressure'],
      date_created: new Date(),
      location: savedLocations[9], // Associate with location
    }),
    Sensors.create({
      type: ['Humidity', 'Pressure'],
      date_created: new Date(),
      location: savedLocations[10], // Associate with location
    }),
  ];

  // Save sensors to the database
  await Sensors.save(sensors);
}