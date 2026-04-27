import { Elysia, t } from 'elysia';
import { eq, and, gte, lte, desc, count } from 'drizzle-orm';
import { db } from '../db';
import { tasks, dailyStats } from '../db/schema';
import { authMiddleware, AuthUser } from '../middleware/auth';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

interface RouteContext {
  getCurrentUser: () => AuthUser;
  query: any;
  params: any;
  body: any;
  set: any;
}

export const statsRoutes = new Elysia({ prefix: '/stats' })
  .use(authMiddleware)
  .get(
    '/today',
    async (ctx) => {
      const { getCurrentUser } = ctx as unknown as RouteContext;
      const user = getCurrentUser();

      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      const [totalTasksResult] = await db
        .select({ count: count() })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, user.userId),
            gte(tasks.createdAt, todayStart),
            lte(tasks.createdAt, todayEnd)
          )
        );

      const [completedTasksResult] = await db
        .select({ count: count() })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, user.userId),
            eq(tasks.status, 'completed'),
            gte(tasks.completedAt, todayStart),
            lte(tasks.completedAt, todayEnd)
          )
        );

      const [pendingTasksResult] = await db
        .select({ count: count() })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, user.userId),
            eq(tasks.status, 'pending'),
            lte(tasks.dueDate, todayEnd)
          )
        );

      const total = totalTasksResult?.count || 0;
      const completed = completedTasksResult?.count || 0;
      const pending = pendingTasksResult?.count || 0;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        success: true,
        data: {
          total,
          completed,
          pending,
          completionRate,
        },
      };
    }
  )
  .get(
    '/summary',
    async (ctx) => {
      const { getCurrentUser, query } = ctx as unknown as RouteContext;
      const user = getCurrentUser();

      const { period = 'week' } = query;
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (period) {
        case 'day':
          startDate = startOfDay(now);
          endDate = endOfDay(now);
          break;
        case 'week':
          startDate = startOfWeek(now, { weekStartsOn: 1 });
          endDate = endOfWeek(now, { weekStartsOn: 1 });
          break;
        case 'month':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        default:
          startDate = startOfWeek(now, { weekStartsOn: 1 });
          endDate = endOfWeek(now, { weekStartsOn: 1 });
      }

      const [totalTasksResult] = await db
        .select({ count: count() })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, user.userId),
            gte(tasks.createdAt, startDate),
            lte(tasks.createdAt, endDate)
          )
        );

      const [completedTasksResult] = await db
        .select({ count: count() })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, user.userId),
            eq(tasks.status, 'completed'),
            gte(tasks.completedAt, startDate),
            lte(tasks.completedAt, endDate)
          )
        );

      const total = totalTasksResult?.count || 0;
      const completed = completedTasksResult?.count || 0;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        success: true,
        data: {
          period,
          startDate,
          endDate,
          totalTasks: total,
          completedTasks: completed,
          completionRate,
        },
      };
    },
    {
      query: t.Object({
        period: t.Optional(t.Enum({ day: 'day', week: 'week', month: 'month' })),
      }),
    }
  )
  .get(
    '/trend',
    async (ctx) => {
      const { getCurrentUser, query } = ctx as unknown as RouteContext;
      const user = getCurrentUser();

      const { days = 7 } = query;
      const now = new Date();
      const startDate = subDays(startOfDay(now), days - 1);

      const stats = await db
        .select()
        .from(dailyStats)
        .where(
          and(
            eq(dailyStats.userId, user.userId),
            gte(dailyStats.date, startDate)
          )
        )
        .orderBy(desc(dailyStats.date));

      return {
        success: true,
        data: {
          days,
          stats,
        },
      };
    },
    {
      query: t.Object({
        days: t.Optional(t.Number({ minimum: 1, maximum: 30 })),
      }),
    }
  );
