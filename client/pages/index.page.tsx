import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const Home = () => {
  const router = useRouter();

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
    <>
      <div>
        <h1>Sakuga AI</h1>
        {searchParams.length > 0 && <p>Search: {searchParams.join(', ')}</p>}
        <input type="search" />
        <button>検索</button>
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
    </>
  );
};

export default Home;
