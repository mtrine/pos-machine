import { HttpStatus } from '@nestjs/common';

export class ErrorCode {
  static readonly NOT_FOUND = new ErrorCode(1404, 'Not found', HttpStatus.NOT_FOUND);

  private constructor(public readonly code: number, public readonly message: string, public readonly status: HttpStatus) { }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
    };
  }
}
