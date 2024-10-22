import express, { Request, Response } from "express";
import { dataSource, generateRandomData } from "../services/db";
import { SensorsData } from "../entities/sensorsData";
import { Sensors } from "../entities/sensors";
import { Location } from "../entities/location";

const router = express.Router()

let rand: NodeJS.Timeout | null = null;

/**
 * Get the sensors from db with their location and data
 */
router.get("/all-data", async (req: Request, res: Response) => {
    try {

        // Fetch current sensor data
        const sensorsRepository = dataSource.getRepository(Sensors);
        const allSensors = await sensorsRepository
            .createQueryBuilder('sensors')
            .leftJoinAndSelect('sensors.location', 'location') // This should work now
            .leftJoinAndSelect('sensors.sensors_data', 'sensors_data') // Ensure this matches the relationship
            .getMany();


        console.log(allSensors[0].sensors_data);
        // console.log(allSensorsData[0].sensor);
        res.send(allSensors);


    } catch (error) {
        console.error('error: ' + error)
        res.status(500).send('get sensors data error');
    }
});

/**
 * Start generating data for the sensors (endless loop until stopped by 'stop-interval' route)
 */
router.get("/start-interval", async (req: Request, res: Response) => {
    try {
        if (!rand) {
            // Only start the interval if it's not already running
            rand = setInterval(async () => {
                await generateRandomData();
            }, 5000);
            console.log("Interval started to generate random sensor data.");
        }

    } catch (error) {
        console.error('Error: ' + error);
        res.status(500).send('Internal server error');
    }
});

/**
 * Stop generating random data for sensors
 */
router.get("/stop-interval", async (req: Request, res: Response) => {
    try {
        if (rand) {
            clearInterval(rand);  // Stop the interval
            rand = null;  // Reset the interval reference
            console.log("Interval stopped.");
            res.send("Interval stopped successfully.");
        } else {
            res.status(400).send("No active interval to stop.");
        }
    } catch (error) {
        console.error('Error: ' + error);
        res.status(500).send('Internal server error');
    }
});




export default router