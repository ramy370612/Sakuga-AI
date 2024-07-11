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
      imageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHjV78SPwV4RNvtcaa1pQ6g7pwwiNpIxMOtBVsPEp5SM2MKeikyS0THPGwuum51iN6sESYAyS-vupILfNV7DDAmXnRLupWMhQicWzeI-jc93I8YMODW99yRL2tDlyYM1Yim63BH33-Xjb7/s180-c/pose_hashiru_guruguru_man.png',
    },
    {
      id: 'test2',
      title: '羅生門',
      author: '芥川龍之介',
      imageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitbdHHvZrtm3TkVh5iaWrR2Y55mqa6UTnKM0t_PNHIKz1dB7bfbV_VMTgfQamZRUXIm3em63FGW7fUV8yBBYaWgkFmasdQY0O2EODwxBQex3Eo4keEqNUFWJcDoShK6BDFCzwgbPNpGwc/s180-c/landmark_chukagai_chouyoumon.png',
    },
    {
      id: 'test3',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTDl81C4SMTFVZC9yP0m0iESBSw_0D53KcR3HGvR27lDFJzFWSDvRawhJEKAeoT19GHEJI8iTwLEMPeuTOcZpLI-BBDatvH2LPHS2S_F6vFFOAJ_56bwfsqNTVjp7shr1_g0QPaAWj1vyp/s180-c/pet_cat_sit.png',
    },
    {
      id: 'test4',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTDl81C4SMTFVZC9yP0m0iESBSw_0D53KcR3HGvR27lDFJzFWSDvRawhJEKAeoT19GHEJI8iTwLEMPeuTOcZpLI-BBDatvH2LPHS2S_F6vFFOAJ_56bwfsqNTVjp7shr1_g0QPaAWj1vyp/s180-c/pet_cat_sit.png',
    },
    {
      id: 'test5',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTDl81C4SMTFVZC9yP0m0iESBSw_0D53KcR3HGvR27lDFJzFWSDvRawhJEKAeoT19GHEJI8iTwLEMPeuTOcZpLI-BBDatvH2LPHS2S_F6vFFOAJ_56bwfsqNTVjp7shr1_g0QPaAWj1vyp/s180-c/pet_cat_sit.png',
    },
    {
      id: 'test6',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTDl81C4SMTFVZC9yP0m0iESBSw_0D53KcR3HGvR27lDFJzFWSDvRawhJEKAeoT19GHEJI8iTwLEMPeuTOcZpLI-BBDatvH2LPHS2S_F6vFFOAJ_56bwfsqNTVjp7shr1_g0QPaAWj1vyp/s180-c/pet_cat_sit.png',
    },
    {
      id: 'test7',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTDl81C4SMTFVZC9yP0m0iESBSw_0D53KcR3HGvR27lDFJzFWSDvRawhJEKAeoT19GHEJI8iTwLEMPeuTOcZpLI-BBDatvH2LPHS2S_F6vFFOAJ_56bwfsqNTVjp7shr1_g0QPaAWj1vyp/s180-c/pet_cat_sit.png',
    },
    {
      id: 'test8',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTDl81C4SMTFVZC9yP0m0iESBSw_0D53KcR3HGvR27lDFJzFWSDvRawhJEKAeoT19GHEJI8iTwLEMPeuTOcZpLI-BBDatvH2LPHS2S_F6vFFOAJ_56bwfsqNTVjp7shr1_g0QPaAWj1vyp/s180-c/pet_cat_sit.png',
    },
    {
      id: 'test9',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTDl81C4SMTFVZC9yP0m0iESBSw_0D53KcR3HGvR27lDFJzFWSDvRawhJEKAeoT19GHEJI8iTwLEMPeuTOcZpLI-BBDatvH2LPHS2S_F6vFFOAJ_56bwfsqNTVjp7shr1_g0QPaAWj1vyp/s180-c/pet_cat_sit.png',
    },
    {
      id: 'test10',
      title: '吾輩は猫である',
      author: '夏目漱石',
      imageUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTDl81C4SMTFVZC9yP0m0iESBSw_0D53KcR3HGvR27lDFJzFWSDvRawhJEKAeoT19GHEJI8iTwLEMPeuTOcZpLI-BBDatvH2LPHS2S_F6vFFOAJ_56bwfsqNTVjp7shr1_g0QPaAWj1vyp/s180-c/pet_cat_sit.png',
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
