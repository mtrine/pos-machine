import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { MetaResponseDto } from './meta-response';

export interface ClassConstructor {
  new (...args: any[]): object;
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        const request = context.switchToHttp().getRequest();
        const { limit, page } = request.query;

        if (Array.isArray(data)) {
          const pageNum = parseInt(page) || 1;
          const limitNum = parseInt(limit) || 10;

          const startIndex = (pageNum - 1) * limitNum;
          const endIndex = startIndex + limitNum;

          const paginatedData = data.slice(startIndex, endIndex);
          const totalItems = data.length;
          const totalPages = Math.ceil(totalItems / limitNum);

          return {
            data: plainToClass(this.dto, paginatedData, {
              excludeExtraneousValues: true,
              exposeUnsetFields: false,
              enableCircularCheck: true,
            }),
            meta: plainToClass(MetaResponseDto, {
              current: pageNum,
              pageSize: limitNum,
              pages: totalPages,
              total: totalItems,
            }),
          };
        }

        // If not an array, simply transform the data
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
          enableCircularCheck: true,
        });
      }),
    );
  }
}
