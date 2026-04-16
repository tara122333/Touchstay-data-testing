import express, { Request, Response } from 'express';
import cors from 'cors';
import { touchStayRouter } from './routes/touchstay.routes';
import LoggerService from './routes/error';
import { LogType } from './routes/types';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const loggerService = new LoggerService();
const currentFileName = 'index.ts';

app.use('/api', touchStayRouter);

app.get('/', async (req: Request, res: Response) => {
  await loggerService.showLogger({
    fileName: currentFileName,
    method: 'touchStayRouter.get',
    inputMetaData: { ...req.params },
    logType: LogType.WARN,
    message: 'Successfully connected to the server',
  });
  res.status(304).send('Done');
});

const port = process.env.PORT ? Number(process.env.PORT) : 80;

app.listen(port, async () => {
  await loggerService.showLogger({
    fileName: currentFileName,
    method: 'touchStayRouter.get',
    logType: LogType.WARN,
    message: `Successfully Listen to the server at port ${port}`,
  });
  console.log(`server running at ${port} \n`);
});
