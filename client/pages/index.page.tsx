import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
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

  const novels = [
    {
      id: 'test',
      title: 'test',
      author: 'test',
      imageUrl: 'https://st.cdjapan.co.jp/pictures/l/12/19/NEOBK-2110612.jpg',
    },
  ];
  const urls = novels.map((novel) => `novel/${novel.id}`);
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
      <label>ランキング</label>
      <div>
        <Link href={urls[0]}>走れメロス</Link>
        <Link href={urls[0]}>羅生門</Link>
      </div>
      <div>
        <Link href={urls[0]}>吾輩は猫である</Link>
        <Link href={urls[0]}>山月記</Link>
      </div>
    </div>
  );
};

export default Home;
