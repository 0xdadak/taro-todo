import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import { codeToSession } from '../utils/wechat';
import { generateToken } from '../utils/jwt';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/login',
    async ({ body, set }) => {
      const { code } = body;
      
      try {
        const session = await codeToSession(code);
        
        if (session.errcode) {
          set.status = 400;
          return {
            success: false,
            error: {
              code: 'WECHAT_ERROR',
              message: session.errmsg || 'Wechat login failed',
            },
          };
        }

        let [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.openId, session.openid))
          .limit(1);

        if (!existingUser) {
          const [newUser] = await db
            .insert(users)
            .values({
              openId: session.openid,
              unionId: session.unionid,
            })
            .returning();
          existingUser = newUser;
        }

        const token = generateToken({
          userId: existingUser.id,
          openId: existingUser.openId,
        });

        return {
          success: true,
          data: {
            token,
            user: {
              id: existingUser.id,
              nickname: existingUser.nickname,
              avatarUrl: existingUser.avatarUrl,
            },
          },
        };
      } catch (err) {
        set.status = 500;
        return {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error',
          },
        };
      }
    },
    {
      body: t.Object({
        code: t.String(),
      }),
    }
  );
