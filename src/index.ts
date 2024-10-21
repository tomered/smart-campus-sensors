import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { dataSource } from "./services/db";
import sensorsDataRouter from './routes/sensorsData'

dotenv.config();

const app: Express = express();
const port = process.env.SPORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use('/sensorsData',sensorsDataRouter)


const main = async () => {
  try {

    await dataSource.initialize();
    // await mockData()

    // const rand = setInterval(async() => {
     
    //   await generateRandomData();

    // },5000)

    

    console.log("Connected to Postgres");
  } catch (err) {
    if (err instanceof Error) {
      if ((err as any).code === "ECONNRESET") {
        console.error("Connection reset by peer. Retrying...");
      } else {
        console.error("Database connection error:", err.message);
      }
    } else {
      console.error("An unexpected error occurred:", err);
    }
  }
};

main();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
