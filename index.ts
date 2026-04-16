import express, { Request, Response } from 'express';
import cors from 'cors';
import { touchStayRouter } from './routes/touchstay.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', touchStayRouter);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Welcome..... Successfully connected to the server');
});

const port = process.env.PORT ? Number(process.env.PORT) : 80;

app.listen(port, () => {
  console.log(`server running at ${port} \n`);
});
