import { APP_NAME } from 'api/@constants';
import type { NovelInfo, RankingInfo } from 'api/@types/novel';
import { useLoading } from 'components/loading/useLoading';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import type { StaticPath } from 'utils/$path';
import { staticPath } from 'utils/$path';
import { apiClient } from 'utils/apiClient';
import styles from './index.module.css';

const Home = () => {
  const [rankings, setRankings] = useState<RankingInfo[]>([]);
  const [searchResults, setSearchResults] = useState<NovelInfo[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();
  const catchApiErr = useCatchApiErr();
  const { loadingElm, setLoading } = useLoading();

  const searchParams = useMemo(() => {
    const searchParam = router.query.search;
    return Array.isArray(searchParam) ? searchParam[0] : searchParam;
  }, [router.query.search]);

  const rankingWithThumbnail = useMemo(() => {
    return rankings.map((novel) => ({
      ...novel,
      thumbnailName: `$${novel.workId}_webp` as keyof StaticPath['images']['novels'],
    }));
  }, [rankings]);

  const handleclick = () => {
    router.push({ query: { search: searchInput } });
  };

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      if (searchParams === undefined) {
        const res = await apiClient.novels.ranking.$get({ query: { limit: 12 } });
        setRankings(res ?? []);
      } else {
        const res = await apiClient.novels.search.$get({ query: { searchParams } });
        setSearchResults(res);
      }
    };

    fetchData()
      .catch(catchApiErr)
      .finally(() => setLoading(false));
  }, [catchApiErr, setLoading, searchParams]);

  return (
    <div className={styles.container}>
      {loadingElm}
      <div>
        <h1 className={styles.title}>{APP_NAME}</h1>
      </div>
      <div className={styles.search}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="作品検索"
          value={searchInput}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
        />
        <button
          className={styles.searchButton}
          disabled={searchInput.trim().length <= 0}
          onClick={handleclick}
        >
          検索
        </button>
      </div>
      <div>
        <h2 className={styles.sectionLabel}>
          {searchResults.length <= 0 ? '人気作品' : '検索結果'}
        </h2>
        <br />
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
