import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor, SerializeInterceptor } from 'src/core/seralize.interceptor';

 
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}