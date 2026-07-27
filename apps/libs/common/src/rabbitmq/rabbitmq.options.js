"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRabbitmqOptions = createRabbitmqOptions;
const microservices_1 = require("@nestjs/microservices");
const rabbitmq_constants_1 = require("./rabbitmq.constants");
function createRabbitmqOptions(configService, queueName) {
    const queue = queueName === "auth"
        ? (configService.get("RABBITMQ_AUTH_QUEUE") ??
            rabbitmq_constants_1.RABBITMQ_AUTH_QUEUE)
        : (configService.get("RABBITMQ_WORKSPACE_QUEUE") ??
            rabbitmq_constants_1.RABBITMQ_WORKSPACE_QUEUE);
    return {
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [
                configService.get("RABBITMQ_URL") ??
                    "amqp://rabbit:rabbit@localhost:5672",
            ],
            queue,
            queueOptions: {
                durable: true,
            },
        },
    };
}
//# sourceMappingURL=rabbitmq.options.js.map