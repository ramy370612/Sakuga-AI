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
      id: 'test1',
      title: '走れメロス',
      author: '太宰治',
      imageUrl: 'https://placehold.jp/150x150.png',
    },
    {
      id: 'test2',
      title: '羅生門',
      author: '芥川龍之介',
      imageUrl: 'https://placehold.jp/150x150.png',
    },
    {
      id: 'test3',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl: 'https://placehold.jp/150x150.png',
    },
    {
      id: 'test4',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl: 'https://placehold.jp/150x150.png',
    },
    {
      id: 'test5',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl: 'https://placehold.jp/150x150.png',
    },
    {
      id: 'test6',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl: 'https://placehold.jp/150x150.png',
    },
    {
      id: 'test7',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl: 'https://placehold.jp/150x150.png',
    },
    {
      id: 'test8',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl: 'https://placehold.jp/150x150.png',
    },
    {
      id: 'test9',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl: 'https://placehold.jp/150x150.png',
    },
    {
      id: 'test10',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl: 'https://placehold.jp/150x150.png',
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
      <label className={styles.ranking}>ランキング</label>
      <div>
        {novels.map((novel, index) => (
          <Link
            className={styles[`work${index + 1}` as keyof typeof styles]}
            href={urls[index]}
            key={novel.id}
          >
            <img src={novel.imageUrl} alt={novel.title} />
            {novel.title}
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Home;
