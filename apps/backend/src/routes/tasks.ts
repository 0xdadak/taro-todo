import { Elysia, t } from 'elysia';
import { eq, and, desc, count, sql } from 'drizzle-orm';
import { db } from '../db';
import { tasks } from '../db/schema';
import { authMiddleware, AuthUser } from '../middleware/auth';
import { createTaskSchema, updateTaskSchema, paginationSchema, taskFilterSchema } from '@taro-todo/shared';
import { TaskStatus, TaskPriority } from '@taro-todo/shared';

interface RouteContext {
  getCurrentUser: () => AuthUser;
  query: any;
  params: any;
  body: any;
  set: any;
}

export const tasksRoutes = new Elysia({ prefix: '/tasks' })
  .use(authMiddleware)
  .get(
    '/',
    async (ctx) => {
      const { getCurrentUser, query, set } = ctx as unknown as RouteContext;
      const user = getCurrentUser();

      const { page, pageSize, status, priority, fromDate, toDate } = query;
      const offset = (page - 1) * pageSize;

      const conditions = [eq(tasks.userId, user.userId)];

      if (status) {
        conditions.push(eq(tasks.status, status as TaskStatus));
      }
      if (priority) {
        conditions.push(eq(tasks.priority, priority as TaskPriority));
      }
      if (fromDate) {
        conditions.push(sql`${tasks.createdAt} >= ${fromDate}`);
      }
      if (toDate) {
        conditions.push(sql`${tasks.createdAt} <= ${toDate}`);
      }

      const whereClause = and(...conditions);

      const [totalResult] = await db
        .select({ count: count() })
        .from(tasks)
        .where(whereClause);

      const tasksList = await db
        .select()
        .from(tasks)
        .where(whereClause)
        .orderBy(desc(tasks.createdAt), desc(tasks.priority))
        .limit(pageSize)
        .offset(offset);

      const total = totalResult?.count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        success: true,
        data: {
          items: tasksList,
          total,
          page,
          pageSize,
          totalPages,
        },
      };
    },
    {
      query: t.Composite([
        paginationSchema,
        taskFilterSchema,
      ]),
    }
  )
  .get(
    '/:id',
    async (ctx) => {
      const { getCurrentUser, params, set } = ctx as unknown as RouteContext;
      const user = getCurrentUser();

      const [task] = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, params.id), eq(tasks.userId, user.userId)))
        .limit(1);

      if (!task) {
        set.status = 404;
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Task not found',
          },
        };
      }

      return {
        success: true,
        data: task,
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    '/',
    async (ctx) => {
      const { getCurrentUser, body, set } = ctx as unknown as RouteContext;
      const user = getCurrentUser();

      try {
        const [newTask] = await db
          .insert(tasks)
          .values({
            userId: user.userId,
            title: body.title,
            description: body.description,
            priority: body.priority,
            dueDate: body.dueDate,
            reminder: body.reminder,
            tags: body.tags,
          })
          .returning();

        return {
          success: true,
          data: newTask,
        };
      } catch (err) {
        set.status = 500;
        return {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to create task',
          },
        };
      }
    },
    {
      body: createTaskSchema,
    }
  )
  .put(
    '/:id',
    async (ctx) => {
      const { getCurrentUser, params, body, set } = ctx as unknown as RouteContext;
      const user = getCurrentUser();

      const [existingTask] = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, params.id), eq(tasks.userId, user.userId)))
        .limit(1);

      if (!existingTask) {
        set.status = 404;
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Task not found',
          },
        };
      }

      const updateData: Record<string, unknown> = {
        updatedAt: sql`NOW()`,
      };

      if (body.title !== undefined) updateData.title = body.title;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.status !== undefined) updateData.status = body.status;
      if (body.priority !== undefined) updateData.priority = body.priority;
      if (body.dueDate !== undefined) updateData.dueDate = body.dueDate;
      if (body.reminder !== undefined) updateData.reminder = body.reminder;
      if (body.tags !== undefined) updateData.tags = body.tags;

      if (body.status === 'completed' && existingTask.status !== 'completed') {
        updateData.completedAt = sql`NOW()`;
      }
      if (body.status && body.status !== 'completed' && existingTask.status === 'completed') {
        updateData.completedAt = null;
      }

      const [updatedTask] = await db
        .update(tasks)
        .set(updateData)
        .where(and(eq(tasks.id, params.id), eq(tasks.userId, user.userId)))
        .returning();

      return {
        success: true,
        data: updatedTask,
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: updateTaskSchema,
    }
  )
  .delete(
    '/:id',
    async (ctx) => {
      const { getCurrentUser, params, set } = ctx as unknown as RouteContext;
      const user = getCurrentUser();

      const [existingTask] = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, params.id), eq(tasks.userId, user.userId)))
        .limit(1);

      if (!existingTask) {
        set.status = 404;
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Task not found',
          },
        };
      }

      await db
        .delete(tasks)
        .where(and(eq(tasks.id, params.id), eq(tasks.userId, user.userId)));

      return {
        success: true,
        data: {
          message: 'Task deleted successfully',
        },
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
