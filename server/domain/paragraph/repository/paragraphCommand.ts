import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI, DallEAPIWrapper } from '@langchain/openai';
import type { Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { ParagraphEntity } from 'api/@types/paragraph';
import {
  OPENAI_API_KEY,
  S3_ACCESS_KEY,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_REGION,
  S3_SECRET_KEY,
} from 'service/envValues';
import { s3 } from 'service/s3Client';

const s3Client = new S3Client({
  forcePathStyle: true,
  ...(S3_ACCESS_KEY && S3_ENDPOINT && S3_SECRET_KEY
    ? {
        endpoint: S3_ENDPOINT,
        region: S3_REGION,
        credentials: { accessKeyId: S3_ACCESS_KEY, secretAccessKey: S3_SECRET_KEY },
      }
    : {}),
});

const downloadImage = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }
  return await response.blob();
};

const uploadToS3 = async (key: string, image: Blob): Promise<void> => {
  const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };

  const buffer = await blobToBuffer(image);

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: `image/png`,
  });
  await s3Client.send(command);
};

const paragraphToPrompt = async (paragraph: ParagraphEntity): Promise<string> => {
  const llm = new ChatOpenAI({
    temperature: 0.2,
    model: 'gpt-4o',
  });
  const parser = new StringOutputParser();
  const message = [
    new SystemMessage(
      '以下の文章から画像生成用のプロンプトを生成して\n- 簡潔に状況を説明すること\n- プロンプトは1000字以内に収めること',
    ),
    new HumanMessage(paragraph.content),
  ];
  const chain = llm.pipe(parser);
  return await chain.invoke(message);
};

const MOCK_IMAGE_URL = 'https://picsum.photos/1792/1024';

export const paragraphCommand = {
  save: async (
    tx: Prisma.TransactionClient,
    paragraph: ParagraphEntity,
    novelId: EntityId['novel'],
  ): Promise<void> => {
    await tx.paragraph.upsert({
      where: {
        novelId_index: { novelId, index: paragraph.index },
      },
      update: { imageKey: paragraph.image?.s3Key },
      create: {
        index: paragraph.index,
        paragraph: paragraph.content,
        imageKey: paragraph.image?.s3Key,
        novelId,
      },
    });
  },
  generateImage: async (
    paragraphs: ParagraphEntity[],
    workId: number,
  ): Promise<ParagraphEntity[]> => {
    const updatedParagraphs: ParagraphEntity[] = [];

    //並列処理するとAPIのリクエスト制限に引っかかるので、順次処理で
    for (const paragraph of paragraphs) {
      try {
        const prompt = await paragraphToPrompt(paragraph);
        const dalle3Tool = new DallEAPIWrapper({
          n: 1,
          model: 'dall-e-3',
          apiKey: OPENAI_API_KEY,
          size: '1792x1024',
        });
        const imageURL = await dalle3Tool.invoke(prompt);

        const imageBlob = await downloadImage(imageURL);
        const key = `novels/images/${workId}/${paragraph.index}.png`;
        await uploadToS3(key, imageBlob);
        const updatedParagraph = {
          ...paragraph,
          image: { url: await s3.getSignedUrl(key), s3Key: key },
        };
        updatedParagraphs.push(updatedParagraph);
      } catch (e) {
        console.log(e);
        updatedParagraphs.push(paragraph);
      }
    }

    return updatedParagraphs;
  },
  generateImageWithMock: async (
    paragraphs: ParagraphEntity[],
    workId: number,
  ): Promise<ParagraphEntity[]> => {
    const updatedParagraphs = await Promise.all(
      paragraphs.map(async (paragraph) => {
        try {
          const imageBlob = await downloadImage(MOCK_IMAGE_URL);
          const key = `novels/images/${workId}/${paragraph.index}.png`;
          await uploadToS3(key, imageBlob);
          return { ...paragraph, image: { url: await s3.getSignedUrl(key), s3Key: key } };
        } catch (e) {
          console.log(e);
          return paragraph;
        }
      }),
    );
    return updatedParagraphs;
  },
};
