import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const code = exception.getStatus() ? exception.getStatus() : 500;
    const msg = exception.message || '服务器错误';
    const res = host.switchToHttp().getResponse();
    res.status(200).json({
      code,
      msg,
    });
  }
}
