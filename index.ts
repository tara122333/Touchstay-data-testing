import express, { Request, Response } from 'express';
import cors from 'cors';
import { touchStayRouter } from './routes/touchstay.routes';
import LoggerService from './routes/error';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const loggerService = new LoggerService();
const currentFileName = 'index.ts';

app.use('/api', touchStayRouter);

app.get('/', async (req: Request, res: Response) => {
  await loggerService.showLogger({
    error: `No Error - Successfully connected to the server`,
    fileName: currentFileName,
    method: 'touchStayRouter.get',
    inputMetaData: { ...req.params },
  });
  res.status(200).send('Welcome..... Successfully connected to the server');
});

const port = process.env.PORT ? Number(process.env.PORT) : 80;

app.listen(port, async () => {
  await loggerService.showLogger({
    error: `No Error - Successfully Listen to the server`,
    fileName: currentFileName,
    method: 'touchStayRouter.get',
  });
});
