import { APP_NAME } from 'api/@constants';
import type { NovelInfo, RankingInfo } from 'api/@types/novel';
import { useLoading } from 'components/loading/useLoading';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
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

  // `/?search=hoge` -> `['hoge']` のように、searchパラメータを配列で取得
  // 検索するキーワードをsearchパラメータとして保持し、それをもとに検索を行う
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

  const keyHandler = (event: React.KeyboardEvent) => {
    const key = event.key;
    if (key === 'Enter') {
      clickHandler();
    }
    return;
  };

  const clickHandler = () => {
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
        <Link href="/">
          <h1 className={styles.title}>{APP_NAME}</h1>
        </Link>
      </div>
      <div className={styles.search}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="作品検索"
          value={searchInput}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
          onKeyDown={keyHandler}
          tabIndex={0}
        />
        <button
          className={styles.searchButton}
          disabled={searchInput.trim().length <= 0}
          onClick={clickHandler}
        >
          検索
        </button>
      </div>
      <div>
        <h2 className={styles.sectionLabel}>
          {searchParams === undefined ? '人気作品' : '検索結果'}
        </h2>
        <br />
        <div className={styles.section}>
          {searchParams === undefined
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
            : searchResults.length === 0
              ? '検索結果がありません'
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
