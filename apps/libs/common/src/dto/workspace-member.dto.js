"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWorkspaceMemberSchema = void 0;
const zod_1 = require("zod");
exports.addWorkspaceMemberSchema = zod_1.z
    .object({
    email: zod_1.z.email().trim().toLowerCase().optional(),
    userId: zod_1.z.uuid().optional(),
})
    .refine(({ email, userId }) => Boolean(email) !== Boolean(userId), {
    message: "Provide either email or userId",
    path: ["email"],
});
//# sourceMappingURL=workspace-member.dto.js.map