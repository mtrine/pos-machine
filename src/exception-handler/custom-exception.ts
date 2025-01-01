import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from 'src/enums/error-code.enum';


export class CustomException extends HttpException {
  constructor(errorCode: ErrorCode) {
    super(
      {
        code: errorCode.code,
        message: errorCode.message,
      },
      errorCode.status,
    );
  }
}
