"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(200),
    boardId: zod_1.z.uuid(),
});
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(200),
});
//# sourceMappingURL=task.dto.js.map