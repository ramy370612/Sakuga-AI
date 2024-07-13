import type { Novel, Prisma, Voice } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { VoiceEntity } from 'api/@types/voice';
import { s3 } from 'service/s3Client';

const toEntity = async (prismaVoice: Voice & { Novel: Novel }): Promise<VoiceEntity> => ({
  index: prismaVoice.index,
  speaker: prismaVoice.speaker,
  audio: { url: await s3.getSignedUrl(prismaVoice.voiceKey), s3Key: prismaVoice.voiceKey },
});

const getVoiceListByNovelId = async (
  tx: Prisma.TransactionClient,
  novelId: EntityId['novel'],
): Promise<VoiceEntity[]> => {
  const voiceList = await tx.voice.findMany({
    where: {
      novelId,
    },
    orderBy: {
      index: 'asc',
    },
    include: {
      Novel: true,
    },
  });
  return Promise.all(voiceList.map(toEntity));
};

export const voiceQuery = {
  getVoiceListByNovelId,
};
