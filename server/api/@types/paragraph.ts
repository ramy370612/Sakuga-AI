export type ParagraphEntity = {
  index: number;
  paragraph: string;
  image: { url: string; s3Key: string } | undefined;
};
