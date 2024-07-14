import type { Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { ParagraphEntity } from 'api/@types/paragraph';
import type { VoiceEntity } from 'api/@types/voice';
import { VOICEVOX_URL } from 'service/envValues';
import { s3 } from 'service/s3Client';

const uploadAudioToS3 = async (key: string, audio: ArrayBuffer): Promise<void> => {
  await s3.putWithBuffer(key, Buffer.from(audio), `audio/wav`);
};

const generateAudioQuery = async (
  paragraph: ParagraphEntity,
  speaker: number,
  workId: number,
): Promise<VoiceEntity> => {
  //VoiceVoxのアクセント句の区切りが「、」なので、改行と。を「、」に変換する
  const separatedText = paragraph.content.replace(/\n/g, '、');
  const params = { speaker: speaker.toString() };
  const queryForAudioQuery = new URLSearchParams(params);
  queryForAudioQuery.append('text', separatedText);

  const audioQueryResponse = await fetch(`${VOICEVOX_URL}/audio_query?${queryForAudioQuery}`, {
    method: 'POST',
  });

  const audioQueryData = await audioQueryResponse.json();

  const queryForAudioData = new URLSearchParams({ speaker: speaker.toString() });

  const audioDataResponse = await fetch(`${VOICEVOX_URL}/synthesis?${queryForAudioData}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(audioQueryData),
  });

  const key = `novels/voice/${workId}/${paragraph.index}.wav`;
  await uploadAudioToS3(key, await audioDataResponse.arrayBuffer());
  return {
    index: paragraph.index,
    speaker,
    audio: {
      url: await s3.getSignedUrl(key),
      s3Key: key,
    },
  };
};

export const voiceCommand = {
  save: async (
    tx: Prisma.TransactionClient,
    voice: VoiceEntity,
    novelId: EntityId['novel'],
  ): Promise<void> => {
    await tx.voice.upsert({
      where: {
        novelId_index: { novelId, index: voice.index },
      },
      update: {
        speaker: voice.speaker,
      },
      create: {
        index: voice.index,
        speaker: voice.speaker,
        novelId,
        voiceKey: voice.audio.s3Key,
      },
    });
  },
  generateAudio: async (
    paragraphs: ParagraphEntity[],
    speaker: number,
    workId: number,
  ): Promise<VoiceEntity[]> => {
    const voices = await Promise.all(
      paragraphs.map((paragraph) => generateAudioQuery(paragraph, speaker, workId)),
    );
    return voices;
  },
};
