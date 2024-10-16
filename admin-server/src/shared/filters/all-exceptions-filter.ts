import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception, 'eee');
    const code = exception?.getStatus?.() ? exception.getStatus() : 500;
    const msg = exception.message || '服务器错误';
    const res = host.switchToHttp().getResponse();
    res.status(200).json({
      code,
      msg,
    });
  }
}
