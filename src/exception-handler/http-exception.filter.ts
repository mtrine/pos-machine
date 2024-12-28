import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Custom mã lỗi
    const errorResponse = exception.getResponse();
    let code = 'UNKNOWN_ERROR'; // Mã lỗi mặc định

    // Kiểm tra nếu errorResponse là object và có custom code
    if (typeof errorResponse === 'object' && errorResponse !== null) {
      code = (errorResponse as any).code || code; // Lấy code từ exception hoặc dùng mặc định
    }

    response.status(status).json({
      statusCode: status,
      code, // Thêm trường code
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'An error occurred', // Lấy message từ exception
    });
  }
}
