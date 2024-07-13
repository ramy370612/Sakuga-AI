import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI, DallEAPIWrapper } from '@langchain/openai';
import type { Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { ParagraphEntity } from 'api/@types/paragraph';
import { downloadImage } from 'service/downloadImage';
import { OPENAI_API_KEY } from 'service/envValues';
import { s3 } from 'service/s3Client';
import { z } from 'zod';

const promptResponseSchema = z.object({
  prompt: z.string().max(1000).describe('Prompt for DALL-E3'),
  altText: z.string().max(1000).describe('画像の代替テキスト'),
});

type PromptResponse = z.infer<typeof promptResponseSchema>;

const uploadImageToS3 = async (key: string, image: Blob): Promise<void> => {
  const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };

  const buffer = await blobToBuffer(image);

  await s3.putWithBuffer(key, buffer, `image/png`);
};

const paragraphToPrompt = async (paragraph: ParagraphEntity): Promise<PromptResponse> => {
  const llm = new ChatOpenAI({
    temperature: 0.2,
    model: 'gpt-4o',
  });
  const message = [
    new SystemMessage(
      `以下の指示に従い、プロンプトを生成して
      0. プロンプトは英語で記述すること
      1. 簡潔に状況を説明すること
      2. 以下の文章のストーリーに沿った挿絵にすること
      3. 画像内には文字を含めないことをプロンプトに明記する
      `,
    ),
    new HumanMessage(paragraph.content),
  ];
  const structuredLlm = llm.withStructuredOutput(promptResponseSchema);
  return await structuredLlm.invoke(message);
};

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
        content: paragraph.content,
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
      await uploadImageToS3(key, imageBlob);
      const updatedParagraph = {
        ...paragraph,
        image: { url: await s3.getSignedUrl(key), s3Key: key },
      };
      updatedParagraphs.push(updatedParagraph);
    }

    return updatedParagraphs;
  },
};
