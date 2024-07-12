import type { NovelBodyEntity } from 'api/@types/novel';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import { useRouter } from 'next/router';
import type { UIEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import styles from './[novelId].module.css';

const Home = () => {
  const [novelBody, setNovelBody] = useState<NovelBodyEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readingParagraph, setReadingParagraph] = useState(0);
  const router = useRouter();
  const catchApiErr = useCatchApiErr();

  // `/novel/123234` -> `123234` のように、novelIdパラメータを取得
  // novelIdパラメータを取得し、それをもとに小説情報を取得する
  const novelId = useMemo(() => {
    const novelIdParam = router.query.novelId;
    return Array.isArray(novelIdParam) ? novelIdParam[0] : novelIdParam ?? '';
  }, [router.query.novelId]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    const children = target.children;
    const containerPosition = target.getBoundingClientRect();

    const readingParagraphVertical = Array.from(children).findIndex(
      (child) => child.getBoundingClientRect().top >= containerPosition.top,
    );
    const readingParagraphHorizontal = Array.from(children).findIndex(
      (child) => child.getBoundingClientRect().right <= containerPosition.right,
    );
    const readingParagraph = Math.max(readingParagraphVertical, readingParagraphHorizontal);

    setReadingParagraph(readingParagraph);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchNovelData = async () => {
      const res = await apiClient.novels.body.$get({ query: { id: novelId } });
      return res;
    };

    fetchNovelData()
      .then(setNovelBody)
      .catch(catchApiErr)
      .finally(() => setIsLoading(false));

    return () => setNovelBody(null);
  }, [novelId, catchApiErr]);

  if (isLoading || novelBody === null) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <hgroup>
          <h1>{novelBody.title}</h1>
          <p>{novelBody.authorName}</p>
        </hgroup>
        <img src={novelBody.paragraphs[readingParagraph]?.imageUrl} alt="" />
      </div>
      <div className={styles.content} onScroll={handleScroll}>
        {novelBody.paragraphs.map((paragraph, index) => (
          <div key={index}>
            <p>{paragraph.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
