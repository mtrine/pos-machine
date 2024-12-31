import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export interface ClassContrustor {
  new(...args: any[]): object;
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassContrustor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        console.log('Raw data:', data); // Debugging raw data

        // Wrap raw data in the correct structure
        const response = plainToClass(this.dto,  data , {  // Wrap the data in an object with the 'data' key
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
          enableCircularCheck: true,
        });

        console.log('Transformed data:', response); // Debugging transformed data
        return response;
      }),
    );
  }
}
