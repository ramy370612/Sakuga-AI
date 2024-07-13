import type { Novel } from '@prisma/client';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: {
      limit: number;
    };
    resBody: (Novel & { rank: number })[] | null;
  };
}>;
