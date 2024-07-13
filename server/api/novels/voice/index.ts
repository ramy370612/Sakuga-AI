import type { VoiceEntity } from 'api/@types/voice';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: {
      id: string;
    };

    resBody: VoiceEntity[] | null;
  };
}>;
