import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred.';

    switch (exception.code) {
      case 'P2000':
        status = HttpStatus.BAD_REQUEST;
        message = 'Value too long for the column type.';
        break;
      case 'P2001':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found.';
        break;
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint violation.';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint failed.';
        break;
      case 'P2004':
        status = HttpStatus.BAD_REQUEST;
        message = 'A database constraint was violated.';
        break;
      case 'P2011':
        status = HttpStatus.BAD_REQUEST;
        message = 'Null constraint violation.';
        break;
      case 'P2015':
        status = HttpStatus.NOT_FOUND;
        message = 'A required related record was not found.';
        break;
      default:
        message = exception.message || message;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.meta || exception.code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
