export type ShowHandleLoggerProps = {
  INPUT?: object;
  error?: unknown;
  fileName?: string;
  inputMetaData?: Record<string, unknown>;
  method?: string;
  logType?: LogType;
  message?: string;
};

export enum LogType {
  INFO = 'info',
  DEBUG = 'debug',
  ERROR = 'error',
  WARN = 'warn',
  CRITICAL = 'critical',
}
