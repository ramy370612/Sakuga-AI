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
      <label className={styles.ranking}>ランキング</label>
      <div>
        <Link className={styles.workFirst} href={urls[0]}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHjV78SPwV4RNvtcaa1pQ6g7pwwiNpIxMOtBVsPEp5SM2MKeikyS0THPGwuum51iN6sESYAyS-vupILfNV7DDAmXnRLupWMhQicWzeI-jc93I8YMODW99yRL2tDlyYM1Yim63BH33-Xjb7/s180-c/pose_hashiru_guruguru_man.png" />
          走れメロス
        </Link>
        <Link className={styles.workSecond} href={urls[0]}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitbdHHvZrtm3TkVh5iaWrR2Y55mqa6UTnKM0t_PNHIKz1dB7bfbV_VMTgfQamZRUXIm3em63FGW7fUV8yBBYaWgkFmasdQY0O2EODwxBQex3Eo4keEqNUFWJcDoShK6BDFCzwgbPNpGwc/s180-c/landmark_chukagai_chouyoumon.png" />
          羅生門
        </Link>
        <Link className={styles.workThird} href={urls[0]}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTDl81C4SMTFVZC9yP0m0iESBSw_0D53KcR3HGvR27lDFJzFWSDvRawhJEKAeoT19GHEJI8iTwLEMPeuTOcZpLI-BBDatvH2LPHS2S_F6vFFOAJ_56bwfsqNTVjp7shr1_g0QPaAWj1vyp/s180-c/pet_cat_sit.png" />
          吾輩は猫である
        </Link>
        <Link className={styles.workForth} href={urls[0]}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvpcHJWc06O2fOJyGvDPJYaEyG_IkSVrFcwdnbTYsG1siEGQi65HQvCnAN39SBawW7NfV785Hke74Xr6wZmph9jV4qxGNwCLoqW6TYeDnWAmhNsqNJ_JnPFXHxF4mSU1Ta47q2ywY7KGA/s180-c/mail.png" />
          こころ
        </Link>
        <Link className={styles.workFifth} href={urls[0]}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWyOmbFy9TaFocOWzffY45PkFIRUYGxLcMhC7ifSbyNLHQ6-WVlUZv0nfViGoHzt25dU-tVBZQUZm7KzeXZe21GDIXxvIp_mqsY_0OSwlcyHu-iXxm9kNpCb9v-zBkpFkJVtDFjd1064c/s180-c/building_akiya.png" />
          注文の多い料理店
        </Link>
      </div>
      <div>
        <Link className={styles.workSixth} href={urls[0]}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZMVFH0uk5RvnlmOKsZdpWreYlW6NV1pqHgyOPDWczZa2Bj269xqKXVh-JOhPdBmNliWuPhFFYLg6c9QTwUUMfZhnCgfcPj6CpXCGofWAEbtPN7CCGbb0MD-7CDfyVo-8hPj8SBg2IAT8/s180-c/train_enoden_kamakura.png" />
          銀河鉄道の夜
        </Link>
        <Link className={styles.workSeventh} href={urls[0]}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhGpjSMc4KfTT15xKlTEsje446dtrU-_k_AAs_sJZy8CSzgoDhBrPwFWIul5mLFdSgkfWAxhdnSVklV9UWwXVS40tuImyivWifaxxsV8-mXE4z2DBE81C13a_If2ZW0ac5jo1vSJB47cug/s180-c/bug_kumo_ito.png" />
          蜘蛛の糸
        </Link>
        <Link className={styles.workEighth} href={urls[0]}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj4-UKr5FosIwR5Y0BNbTVK7I82-35xRAgn1ivNTtyeaIPzpUl9lOyO-jJ6htmjnGH-DcDmcU3GBc6VPEoqOOFy_YdKhdfGfwu4u0i4ekL90gu_fIYFTxfYBhJHuauOm89pIoRzMufKfEFJ/s180-c/1_26.png" />
          坊っちゃん
        </Link>
        <Link className={styles.workNineth} href={urls[0]}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEinEtpW5LwOoycoV9rSZMxXrJyO8cKj2QUYdpnKGl8XwJHEvObHJtYCizPnK4XHuXRRbOai7zIAUN26sYLt42TkriEtqVnNt1iQBNaxT3wfT0-IS7A8a5T8fQ0OGI20wkn-i-eSsomfV9I/s180-c/pose_ochikomu_businessman.png" />
          人間失格
        </Link>
        <Link className={styles.workTenth} href={urls[0]}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj92pMMHVB_LGWIcnJIuycUhXDR3kPX-JHrvmoz9HS73sw9yxT07gMsHVxMD7obAbZNQCBRt13l7dig0KRS7eoy7lx_wXJ-WsZpEJdFsv32yGFKFFV36pwvgI8EA48IESYMNm_SmW9OZ60/s180-c/animal_tora.png" />
          山月記
        </Link>
      </div>
    </div>
  );
};

export default Home;
