import { useLoading } from 'components/loading/useLoading';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import styles from './index.module.css';

type UnwrapPromise<T extends Promise<unknown>> = T extends Promise<infer U> ? U : never;

const Home = () => {
  const [rankings, setRankings] = useState<
    UnwrapPromise<ReturnType<typeof apiClient.novels.ranking.$get>>
  >([]);
  const [searchResults, setSearchResults] = useState([]);
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

  if (searchParams === undefined) {
    console.log(1);
  }

  const handleclick = () => {
    router.push({ query: { search: searchInput } });
  };

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      const res = await apiClient.novels.ranking.$get({ query: { limit: 10 } });
      return res ?? [];
    };

    fetch()
      .then(setRankings)
      .catch(catchApiErr)
      .finally(() => setLoading(false));

    return () => setRankings([]);
  }, [catchApiErr, setLoading]);

  return (
    <div className={styles.container}>
      {loadingElm}
      <div>
        <h1 className={styles.title}>Sakuga AI</h1>
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
          {searchResults.length <= 0 &&
            rankings?.map((novel) => (
              <Link key={novel.id} className={styles.novelContainer} href={`/novel/${novel.id}`}>
                <div className={styles.novelCard}>
                  <div className={styles.novelImage}>
                    <img
                      src="https://placehold.jp/150x150.png"
                      alt={`${novel.title}'s thumbnail`}
                    />
                  </div>
                  <div>
                    <h3>{novel.title}</h3>
                    <p>{`${novel.authorSurname} ${novel.authorGivenName}`.trim()}</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
