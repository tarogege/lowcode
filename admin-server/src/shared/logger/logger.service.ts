import { Injectable } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';

@Injectable()
export class LoggerService {
  private context?: string;
  private logger?: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(format.timestamp(), format.prettyPrint()),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  setContext(newCtx: string) {
    this.context = newCtx;
  }

  error(ctx: string, message: string, meta: Record<string, any>) {
    return this.logger.error({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  info(ctx: string, message: string, meta: Record<string, any>) {
    return this.logger.info({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  warn(ctx: string, message: string, meta: Record<string, any>) {
    return this.logger.warn({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  debug(ctx: string, message: string, meta: Record<string, any>) {
    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  verbose(ctx: string, message: string, meta?: Record<string, any>): Logger {
    return this.logger.verbose({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
}
