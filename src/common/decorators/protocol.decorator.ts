import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Protocol = createParamDecorator(
    (defaultValue: unknown, ctx: ExecutionContext) =>
        ctx.switchToHttp().getRequest<Request>().protocol,
);
