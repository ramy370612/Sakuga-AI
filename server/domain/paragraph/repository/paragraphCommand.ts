import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI, DallEAPIWrapper } from '@langchain/openai';
import type { Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { ParagraphEntity } from 'api/@types/paragraph';
import { downloadImage } from 'service/downloadImage';
import { OPENAI_API_KEY } from 'service/envValues';
import { s3 } from 'service/s3Client';

const uploadToS3 = async (key: string, image: Blob): Promise<void> => {
  const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };

  const buffer = await blobToBuffer(image);

  await s3.putWithBuffer(key, buffer, `image/png`);
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

    for (let i = 0; i < paragraphs.length; i += 2) {
      const chunk = paragraphs.slice(i, i + 2);

      const promises = chunk.map(async (paragraph) => {
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
        return updatedParagraph;
      });

      const results = await Promise.all(promises);
      updatedParagraphs.push(...results);
    }

    return updatedParagraphs;
  },
};
