import { PipeTransform } from "@nestjs/common";
import { type ZodType } from "zod";
export declare class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
    private readonly schema;
    constructor(schema: ZodType<T>);
    transform(value: unknown): T;
}
