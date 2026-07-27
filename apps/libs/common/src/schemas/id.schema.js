"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalIdSchema = exports.idSchema = void 0;
const zod_1 = require("zod");
exports.idSchema = zod_1.z.uuid();
exports.optionalIdSchema = exports.idSchema.optional();
//# sourceMappingURL=id.schema.js.map