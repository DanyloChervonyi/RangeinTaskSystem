import { HttpException } from "@nestjs/common";
import type { ExceptionFilter } from "@nestjs/common";
export declare class RabbitmqHttpExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException): any;
}
