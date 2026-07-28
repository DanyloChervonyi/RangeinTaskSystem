import {
  GatewayTimeoutException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, lastValueFrom, timeout, TimeoutError } from "rxjs";

@Injectable()
export class RabbitmqClientService {
  private readonly requestTimeoutMs: number;

  constructor(
    private readonly authClient: ClientProxy,
    private readonly usersClient: ClientProxy,
    private readonly workspaceClient: ClientProxy,
    configService: ConfigService,
  ) {
    this.requestTimeoutMs =
      configService.get<number>("RABBITMQ_REQUEST_TIMEOUT_MS") ?? 5000;
  }

  request<Response>(pattern: string, payload: unknown): Promise<Response> {
    const client = this.resolveClient(pattern);

    return lastValueFrom(
      client.send<Response>(pattern, payload).pipe(
        timeout(this.requestTimeoutMs),
        catchError((error: unknown) => {
          if (error instanceof TimeoutError)
            throw new GatewayTimeoutException("Microservice request timed out");
          if (this.isRpcHttpError(error))
            throw new HttpException(error, error.statusCode);
          if (error instanceof Error) throw error;
          throw new InternalServerErrorException("Microservice request failed");
        }),
      ),
    );
  }

  private resolveClient(pattern: string) {
    if (pattern.startsWith("auth.")) return this.authClient;
    if (pattern.startsWith("users.")) return this.usersClient;
    return this.workspaceClient;
  }

  private isRpcHttpError(
    error: unknown,
  ): error is Record<string, unknown> & { statusCode: number } {
    return (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
    );
  }
}
