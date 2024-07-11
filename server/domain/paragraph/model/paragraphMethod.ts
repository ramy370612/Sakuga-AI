import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import type { ParagraphEntity } from 'api/@types/paragraph';
import { novelUseCase } from 'domain/novel/useCase/novelUseCase';
import { OPENAI_API_KEY } from 'service/envValues';
import { z } from 'zod';

const responseSchema = z.object({
  paragraphs: z.array(
    z.object({
      content: z.string(),
    }),
  ),
});

const separateParagraphs = async (novelText: string): Promise<string[]> => {
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    apiKey: OPENAI_API_KEY,
    temperature: 0,
  });
  const structuredLlm = model.withStructuredOutput(responseSchema);

  const message = new HumanMessage({
    content: [
      {
        type: 'text',
        text: `以下の文章を、挿絵を生成することを考えて、文章を分割してください
        以下の命令に従うこと
        - 読み仮名は削除すること
        - 文章を省略しないこと
        - 一場面400~800文字程度で分割して
        ${novelText}`,
      },
    ],
  });

  const res = await structuredLlm.invoke([message]);

  return res.paragraphs.map((paragraph) => paragraph.content);
};

export const paragraphMethod = {
  create: async (workId: number): Promise<ParagraphEntity[]> => {
    const paragraphs: ParagraphEntity[] = [];

    const novelText = await novelUseCase.gettext(workId);
    if (!novelText) {
      throw new Error('novel text not found');
    }
    const separatedParagraphs = await separateParagraphs(novelText);

    console.log(separatedParagraphs);
    separatedParagraphs.map((paragraph, index) => {
      paragraphs.push({
        index,
        paragraph,
        image: undefined,
      });
    });

    return paragraphs;
  },
};
