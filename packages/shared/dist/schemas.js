import { z } from 'zod';
import { TASK_STATUSES, TASK_PRIORITIES } from './constants';
export const createTaskSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
    priority: z.enum(TASK_PRIORITIES).optional().default('medium'),
    dueDate: z.coerce.date().optional(),
    reminder: z.coerce.date().optional(),
    tags: z.array(z.string()).optional().default([]),
});
export const updateTaskSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(TASK_STATUSES).optional(),
    priority: z.enum(TASK_PRIORITIES).optional(),
    dueDate: z.coerce.date().optional().nullable(),
    reminder: z.coerce.date().optional().nullable(),
    tags: z.array(z.string()).optional(),
});
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export const wechatLoginSchema = z.object({
    code: z.string().min(1),
});
export const taskFilterSchema = z.object({
    status: z.enum(TASK_STATUSES).optional(),
    priority: z.enum(TASK_PRIORITIES).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    tags: z.string().optional(),
});
//# sourceMappingURL=schemas.js.map