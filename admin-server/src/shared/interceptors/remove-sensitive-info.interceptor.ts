import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class RemoveSensitiveInfoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((res) => {
        // 删除敏感信息
        // password， salt
        this.delValue(res, 'password');
        this.delValue(res, 'salt');
        return {
          code: 200,
          result: res,
        };
      }),
    );
  }

  delValue(data, targetKey) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key === targetKey) {
          delete data[key];
        } else if (typeof data[key] === 'object') {
          this.delValue(data[key], targetKey);
        }
      }
    }
  }
}
