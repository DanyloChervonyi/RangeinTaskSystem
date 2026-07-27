"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
    name: zod_1.z.string().trim().min(1).max(80).optional(),
    password: zod_1.z.string().min(8).max(128),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
    password: zod_1.z.string().min(1).max(128),
});
//# sourceMappingURL=auth.dto.js.map