"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTagInputSchema = exports.createTagInputSchema = exports.updateProjectInputSchema = exports.createProjectInputSchema = exports.updateTaskInputSchema = exports.createTaskInputSchema = void 0;
const zod_1 = require("zod");
// Task validation schemas
exports.createTaskInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
    priority: zod_1.z.number().int().min(0).max(3),
    status: zod_1.z.number().int().min(0).max(4),
    progress: zod_1.z.number().int().min(0).max(100).optional().default(0),
    projectId: zod_1.z.number().int().optional(),
});
exports.updateTaskInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title cannot be empty').optional(),
    description: zod_1.z.string().optional(),
    priority: zod_1.z.number().int().min(0).max(3).optional(),
    status: zod_1.z.number().int().min(0).max(4).optional(),
    progress: zod_1.z.number().int().min(0).max(100).optional(),
    projectId: zod_1.z.number().int().optional(),
});
// Project validation schemas
exports.createProjectInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
});
exports.updateProjectInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title cannot be empty').optional(),
    description: zod_1.z.string().optional(),
});
// Tag validation schemas
exports.createTagInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
});
exports.updateTagInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title cannot be empty').optional(),
});
//# sourceMappingURL=schemas.js.map