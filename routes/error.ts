import axios from "axios";
import { ShowHandleLoggerProps } from "./types";

const apiUrl = 'https://portal-uat.welcomescreen.com/api';
export default class LoggerService {
  showLogger = async (params: ShowHandleLoggerProps): Promise<void> => {
    try {
      await axios.post(`${apiUrl}/logger`, { ...params, applicationType: 'TouchStay Scrapping Tool' });
    } catch (e) {
      await axios.post(`${apiUrl}/logger`, {
        message: JSON.stringify(e),
        method: 'Calling LoggerService.showLogger',
        applicationType: 'TouchStay Scrapping Tool',
      });
    }
  };
}
