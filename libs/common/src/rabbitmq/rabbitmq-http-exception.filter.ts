import { Catch, HttpException } from "@nestjs/common";
import type { ExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { throwError } from "rxjs";

@Catch(HttpException)
export class RabbitmqHttpExceptionFilter
  implements ExceptionFilter<HttpException>
{
  catch(exception: HttpException) {
    const response = exception.getResponse();
    const payload =
      typeof response === "string"
        ? {
            message: response,
            statusCode: exception.getStatus(),
          }
        : {
            ...(response as Record<string, unknown>),
            statusCode: exception.getStatus(),
          };

    return throwError(() => new RpcException(payload));
  }
}
