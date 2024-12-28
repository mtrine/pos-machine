import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
  } from '@nestjs/common';
  import { MongoServerError } from 'mongodb';
  
  @Catch(MongoServerError)
  export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoServerError, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error with MongoDB';
      let code = 1000; // Mã lỗi mặc định (UNKNOWN)
  
      // Phân loại lỗi dựa trên mã lỗi MongoDB
      switch (exception.code) {
        case 11000: // Duplicate key error
          status = HttpStatus.CONFLICT;
          message =
            'Duplicate key error: A record with the same value already exists.';
          code = 1100; // Mã lỗi custom cho Duplicate Key
          break;
        case 121: // Document validation error
          status = HttpStatus.BAD_REQUEST;
          message = 'Document validation failed. Please check your input.';
          code = 1210; // Mã lỗi custom cho Validation
          break;
        case 50: // Exceeded time limit for an operation
          status = HttpStatus.REQUEST_TIMEOUT;
          message = 'MongoDB operation timed out. Please try again later.';
          code = 1050; // Mã lỗi custom cho Timeout
          break;
        default: // Các lỗi khác
          message = exception.message || message;
          code = 1000; // Mã lỗi custom cho các lỗi chưa xác định
          break;
      }
  
      // Trả về response với mã lỗi cụ thể
      response.status(status).json({
        statusCode: status,
        code, // Mã lỗi là số
        message,
        error: exception.message, // Lỗi gốc từ MongoDB
        timestamp: new Date().toISOString(),
      });
    }
  }
  