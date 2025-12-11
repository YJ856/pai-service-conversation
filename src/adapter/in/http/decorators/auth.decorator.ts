import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

type AuthField = 'userId' | 'profileId' | 'profileType';

export const Auth = createParamDecorator(
  (field: AuthField | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const { auth } = req;

    if (!field) {
      return auth
        ? {
            userId: auth.userId ? Number(auth.userId) : undefined,
            profileId: auth.profileId ? Number(auth.profileId) : undefined,
            profileType: auth.profileType
              ? String(auth.profileType)
              : undefined,
          }
        : undefined;
    }

    if (field === 'profileType') {
      const value = auth?.profileType;
      return value === 'child' || value === 'parent' ? value : undefined;
    }

    const value = auth?.[field];
    return value !== undefined && value !== null ? Number(value) : undefined;
  },
);
