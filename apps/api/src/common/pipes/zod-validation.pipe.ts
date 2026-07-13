import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { flattenError, type ZodType } from "zod";

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: "Validation failed",
        errors: flattenError(result.error),
      });
    }
    return result.data;
  }
}
