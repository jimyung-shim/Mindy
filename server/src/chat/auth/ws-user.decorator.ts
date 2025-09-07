import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WsUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const client = ctx.switchToWs().getClient();
  return client.user as { userId: string };
});
