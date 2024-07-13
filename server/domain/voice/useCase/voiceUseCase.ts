import type { Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { NovelBodyEntity } from 'api/@types/novel';
import type { VoiceEntity } from 'api/@types/voice';
import { novelQuery } from 'domain/novel/repository/novelQuery';
import { paragraphQuery } from 'domain/paragraph/repository/paragraphQuery';
import { transaction } from 'service/prismaClient';
import { voiceCommand } from '../repository/voiceCommand';
import { voiceQuery } from '../repository/voiceQuery';

const VOICEVOX_SPEAKER = 23;

const fetchVoice = async (
  tx: Prisma.TransactionClient,
  novelId: EntityId['novel'],
): Promise<VoiceEntity[]> => {
  return voiceQuery.getVoiceListByNovelId(tx, novelId);
};

const createAndSaveVoices = async (
  workId: number,
  novel: NovelBodyEntity,
): Promise<VoiceEntity[]> => {
  const paragraphs = await transaction('RepeatableRead', async (tx) => {
    return await paragraphQuery.listByNovelId(tx, novel.id);
  });
  const voices = await voiceCommand.generateAudio(paragraphs, VOICEVOX_SPEAKER, workId);
  voices.map(async (voice) => {
    await transaction('RepeatableRead', async (tx) => {
      await voiceCommand.save(tx, voice, novel.id);
    });
  });
  return voices;
};

const voiceUseCase = {
  getOrCreateVoices: async (novelId: EntityId['novel']): Promise<VoiceEntity[] | null> => {
    const novel = await transaction('RepeatableRead', async (tx) => {
      return novelQuery.getNovelById(tx, novelId);
    });
    if (novel === null) return null;
    return await transaction('RepeatableRead', async (tx) => {
      const voices = await fetchVoice(tx, novel.id);
      if (voices.length === 0) {
        return await createAndSaveVoices(novel.workId, novel);
      }
      return voices;
    });
  },
};

export { voiceUseCase };
