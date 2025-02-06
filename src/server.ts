import express, { Request, Response } from 'express';
import dotenv from "dotenv";

dotenv.config({ path: require('find-config')('.env') });

const app = express();

const port = process.env.DEV_PORT || 3000;
console.log(process.env.DEV_PORT)
// Define a route for the root path ('/')
app.get('/', (req: Request, res: Response) => {
  res.send('Matthews NodeJS API using Typescript!');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});