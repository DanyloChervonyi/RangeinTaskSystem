import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: "ok",
      service: "rangein-task-system-api",
      pod: process.env.HOSTNAME ?? "local"
    };
  }
}
