"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBoardSchema = exports.createBoardSchema = void 0;
const zod_1 = require("zod");
exports.createBoardSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(120),
    workspaceId: zod_1.z.uuid(),
});
exports.updateBoardSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(120),
});
//# sourceMappingURL=board.dto.js.map