import { z } from 'zod';
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodDefault<z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>>;
    dueDate: z.ZodOptional<z.ZodDate>;
    reminder: z.ZodOptional<z.ZodDate>;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    priority: "low" | "medium" | "high";
    tags: string[];
    description?: string | undefined;
    dueDate?: Date | undefined;
    reminder?: Date | undefined;
}, {
    title: string;
    description?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
    dueDate?: Date | undefined;
    reminder?: Date | undefined;
    tags?: string[] | undefined;
}>;
export declare const updateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["pending", "in_progress", "completed", "cancelled"]>>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    reminder: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
    dueDate?: Date | null | undefined;
    reminder?: Date | null | undefined;
    status?: "pending" | "in_progress" | "completed" | "cancelled" | undefined;
    tags?: string[] | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
    dueDate?: Date | null | undefined;
    reminder?: Date | null | undefined;
    status?: "pending" | "in_progress" | "completed" | "cancelled" | undefined;
    tags?: string[] | undefined;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
}, {
    page?: number | undefined;
    pageSize?: number | undefined;
}>;
export declare const wechatLoginSchema: z.ZodObject<{
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
}, {
    code: string;
}>;
export declare const taskFilterSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["pending", "in_progress", "completed", "cancelled"]>>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    tags: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    priority?: "low" | "medium" | "high" | undefined;
    status?: "pending" | "in_progress" | "completed" | "cancelled" | undefined;
    tags?: string | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
}, {
    priority?: "low" | "medium" | "high" | undefined;
    status?: "pending" | "in_progress" | "completed" | "cancelled" | undefined;
    tags?: string | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
}>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type WechatLoginInput = z.infer<typeof wechatLoginSchema>;
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;
//# sourceMappingURL=schemas.d.ts.map