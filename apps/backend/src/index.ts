import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { authRoutes } from './routes/auth';
import { tasksRoutes } from './routes/tasks';
import { usersRoutes } from './routes/users';
import { statsRoutes } from './routes/stats';
import { API_BASE_PATH } from '@taro-todo/shared';

const PORT = parseInt(process.env.PORT || '3000', 10);

const app = new Elysia()
  .use(cors())
  .get('/', () => ({
    name: 'Taro Todo API',
    version: '1.0.0',
    status: 'ok',
  }))
  .get('/health', () => ({ status: 'healthy', timestamp: new Date().toISOString() }))
  .group(API_BASE_PATH, (group) =>
    group
      .use(authRoutes)
      .use(tasksRoutes)
      .use(usersRoutes)
      .use(statsRoutes)
  )
  .onError(({ code, error, set }) => {
    const errorMessage = 'message' in error ? error.message : String(error);
    console.error(`[${code}] ${errorMessage}`);
    
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Endpoint not found',
        },
      };
    }

    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: errorMessage,
        },
      };
    }

    set.status = 500;
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : errorMessage,
      },
    };
  })
  .listen(PORT);

console.log(`🚀 Server is running on http://localhost:${PORT}`);
console.log(`📖 API base path: ${API_BASE_PATH}`);
console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);

export type App = typeof app;
