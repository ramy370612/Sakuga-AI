export type VoiceEntity = {
  index: number;
  speaker: number;
  audio: { url: string; s3Key: string };
};
