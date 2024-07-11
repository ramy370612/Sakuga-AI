import { useCatchApiErr } from 'hooks/useCatchApiErr';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import styles from './index.module.css';

type UnwrapPromise<T extends Promise<unknown>> = T extends Promise<infer U> ? U : never;

const Home = () => {
  const [rankings, setRankings] = useState<
    UnwrapPromise<ReturnType<typeof apiClient.novels.ranking.$get>>
  >([]);
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();
  const catchApiErr = useCatchApiErr();

  // `/?search=hoge` -> `['hoge']` のように、searchパラメータを配列で取得
  // 検索するキーワードをsearchパラメータとして保持し、それをもとに検索を行う
  const searchParams = useMemo(() => {
    const searchParam = router.query.search;
    return Array.isArray(searchParam)
      ? searchParam
      : searchParam !== undefined
        ? [searchParam]
        : [];
  }, [router.query.search]);

  useEffect(() => {
    const fetch = async () => {
      const res = await apiClient.novels.ranking.$get({ query: { limit: 10 } });
      return res ?? [];
    };

    fetch().then(setRankings).catch(catchApiErr);

    return () => setRankings([]);
  }, [catchApiErr]);

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Sakuga AI</h1>
        {searchParams.length > 0 && <p>Search: {searchParams.join(', ')}</p>}
        <input
          className={styles.searchWindow}
          type="search"
          placeholder="作品検索"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className={styles.searchButton}>検索</button>
      </div>
      <label className={styles.ranking}>ランキング</label>
      <div>
        {searchInput.length <= 0 &&
          rankings?.map((novel, i) => (
            <div key={novel.id}>
              <p>
                {i + 1}位: {novel.title}
              </p>
              <p>
                作者: {novel.authorSurname} {novel.authorGivenName}
              </p>
              <p>アクセス数: {novel.totalAccessCount}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
