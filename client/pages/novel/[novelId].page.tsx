import { APP_NAME } from 'api/@constants';
import type { NovelBodyEntity, NovelInfo, RankingInfo } from 'api/@types/novel';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import { ArrowLeft, Github } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { UIEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { StaticPath } from 'utils/$path';
import { staticPath } from 'utils/$path';
import { apiClient } from 'utils/apiClient';
import styles from './[novelId].module.css';

const Home = () => {
  const [novelBody, setNovelBody] = useState<NovelBodyEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readingParagraph, setReadingParagraph] = useState(0);
  const [rankings, setRankings] = useState<RankingInfo[]>([]);
  const [searchResults, setSearchResults] = useState<NovelInfo[]>([]);
  const router = useRouter();
  const catchApiErr = useCatchApiErr();

  const novelId = useMemo(() => {
    const novelIdParam = router.query.novelId;
    return Array.isArray(novelIdParam) ? novelIdParam[0] : novelIdParam ?? '';
  }, [router.query.novelId]);

  const searchParams = useMemo(() => {
    const searchParam = router.query.search;
    return Array.isArray(searchParam) ? searchParam[0] : searchParam;
  }, [router.query.search]);

  const rankingWithThumbnail = useMemo(() => {
    const filteredRankings = rankings.filter((novel) => novel.id !== novelId);
    const remainingCount = 4 - filteredRankings.length;
    if (remainingCount > 0 && rankings.length > 0) {
      const additionalRankings = rankings.slice(
        filteredRankings.length,
        filteredRankings.length + remainingCount,
      );
      return [...filteredRankings, ...additionalRankings].map((novel) => ({
        ...novel,
        thumbnailName: `$${novel.workId}_webp` as keyof StaticPath['images']['novels'],
      }));
    }
    return filteredRankings.map((novel) => ({
      ...novel,
      thumbnailName: `$${novel.workId}_webp` as keyof StaticPath['images']['novels'],
    }));
  }, [rankings, novelId]);

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
      const res = await apiClient.novels.body.mock.$get({ query: { id: 'mock' } });
      return res;
    };

    fetchNovelData()
      .then(setNovelBody)
      .catch(catchApiErr)
      .finally(() => setIsLoading(false));

    const fetchData = async () => {
      if (searchParams === undefined) {
        const res = await apiClient.novels.ranking.$get({ query: { limit: 4 } });
        setRankings(res ?? []);
      } else {
        const res = await apiClient.novels.search.$get({ query: { searchParams } });
        setSearchResults(res);
      }
    };

    fetchData()
      .catch(catchApiErr)
      .finally(() => setIsLoading(false));

    return () => setNovelBody(null);
  }, [novelId, catchApiErr, searchParams]);

  if (isLoading || novelBody === null) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">
          <ArrowLeft size="1.2rem" />
          <span>作品一覧</span>
        </Link>
        <Link href="/">
          <h1>{APP_NAME}</h1>
        </Link>
        <Link href="https://github.com/ramy370612/Sakuga-AI">
          <Github size="1.2rem" />
        </Link>
      </header>
      <div className={styles.image}>
        <hgroup>
          <h1>{novelBody.title}</h1>
          <p>{novelBody.authorName}</p>
        </hgroup>
        <img src={novelBody.paragraphs[readingParagraph]?.image?.url} alt="" />
      </div>
      <div className={styles.content} onScroll={handleScroll}>
        {novelBody.paragraphs.map((paragraph, index) => (
          <div key={index}>
            <p>{paragraph.content}</p>
          </div>
        ))}
        <h1>{novelBody.title}を読んだ人に合う作品</h1>
        <div className={styles.section}>
          {searchResults.length <= 0
            ? rankingWithThumbnail?.map((novel) => (
                <Link key={novel.id} className={styles.novelContainer} href={`/novel/${novel.id}`}>
                  <div className={styles.novelCard}>
                    <div className={styles.novelImage}>
                      <img
                        src={staticPath.images.novels[novel.thumbnailName]}
                        alt={`${novel.title}'s thumbnail`}
                      />
                    </div>
                    <div>
                      <h3>{novel.title}</h3>
                      <p>{`${novel.authorSurname} ${novel.authorGivenName}`.trim()}</p>
                    </div>
                  </div>
                </Link>
              ))
            : searchResults.map((novel) => (
                <Link
                  key={novel.title}
                  className={styles.novelContainer}
                  href={`/novel/${novel.id}`}
                >
                  <div className={styles.novelCard}>
                    <h3>{novel.title}</h3>
                    <p>{`${novel.authorSurname} ${novel.authorGivenName}`.trim()}</p>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
