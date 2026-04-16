import { Router, Request, Response } from 'express';
import { fetchTouchStayGuideResponse } from './util';
import LoggerService from './error';

export const touchStayRouter = Router();
const loggerService = new LoggerService();
const currentFileName = 'touchStay.routes.ts';

touchStayRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const pageUrl = `https://guide.touchstay.com/guest/${id}/`;
  try {
    const responseData = await fetchTouchStayGuideResponse(pageUrl);
    return res.status(200).json(responseData);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await loggerService.showLogger({
      error: `Error in creating short url: Error:- ${JSON.stringify(error)}`,
      fileName: currentFileName,
      method: 'touchStayRouter.get',
      inputMetaData: { ...req.params },
    });
    return res.status(500).send({
      success: false,
      message: `Error fetching data for id ${id}: ${message}`,
      error: message,
    });
  }
});
