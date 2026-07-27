import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(configService: ConfigService) {
    this.client = new Redis({
      db: configService.get<number>("REDIS_DB") ?? 0,
      host: configService.get<string>("REDIS_HOST") ?? "localhost",
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      password: configService.get<string>("REDIS_PASSWORD"),
      port: configService.get<number>("REDIS_PORT") ?? 6379,
    });

    this.client.on("error", (error) => {
      this.logger.warn(`Redis error: ${error.message}`);
    });
  }

  async getJson<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      this.logger.warn(`Redis get failed for ${key}: ${this.message(error)}`);
      return null;
    }
  }

  async setJson(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (error) {
      this.logger.warn(`Redis set failed for ${key}: ${this.message(error)}`);
    }
  }

  async deleteByPattern(pattern: string): Promise<void> {
    try {
      const keys: string[] = [];
      let cursor = "0";

      do {
        const [nextCursor, batch] = await this.client.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          100,
        );
        cursor = nextCursor;
        keys.push(...batch);
      } while (cursor !== "0");
      if (keys.length > 0) await this.client.del(...keys);
    } catch (error) {
      this.logger.warn(
        `Redis delete failed for ${pattern}: ${this.message(error)}`,
      );
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
  private message(error: unknown) {
    return error instanceof Error ? error.message : "unknown error";
  }
}
