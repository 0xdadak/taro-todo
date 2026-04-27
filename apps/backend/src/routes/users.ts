import { Elysia, t } from 'elysia';
import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import { authMiddleware, AuthUser } from '../middleware/auth';

interface RouteContext {
  getCurrentUser: () => AuthUser;
  query: any;
  params: any;
  body: any;
  set: any;
}

export const usersRoutes = new Elysia({ prefix: '/users' })
  .use(authMiddleware)
  .get(
    '/me',
    async (ctx) => {
      const { getCurrentUser, set } = ctx as unknown as RouteContext;
      const user = getCurrentUser();

      const [currentUser] = await db
        .select({
          id: users.id,
          openId: users.openId,
          unionId: users.unionId,
          nickname: users.nickname,
          avatarUrl: users.avatarUrl,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, user.userId))
        .limit(1);

      if (!currentUser) {
        set.status = 404;
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        };
      }

      return {
        success: true,
        data: currentUser,
      };
    }
  )
  .put(
    '/me',
    async (ctx) => {
      const { getCurrentUser, body, set } = ctx as unknown as RouteContext;
      const user = getCurrentUser();

      const updateData: Record<string, unknown> = {
        updatedAt: sql`NOW()`,
      };

      if (body.nickname !== undefined) updateData.nickname = body.nickname;
      if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;

      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, user.userId))
        .returning({
          id: users.id,
          nickname: users.nickname,
          avatarUrl: users.avatarUrl,
          updatedAt: users.updatedAt,
        });

      return {
        success: true,
        data: updatedUser,
      };
    },
    {
      body: t.Object({
        nickname: t.Optional(t.String().max(100)),
        avatarUrl: t.Optional(t.String().max(500)),
      }),
    }
  );
