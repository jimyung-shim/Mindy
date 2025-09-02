import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type RequestUser = { userId: string; email: string };

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: RequestUser }>();
    return req.user as RequestUser | undefined;
  },
);
