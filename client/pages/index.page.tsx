import { useRouter } from "next/router";
import { useMemo } from "react";

const Home = () => {
  const router = useRouter()

  // `/?search=hoge` -> `['hoge']` のように、searchパラメータを配列で取得
  // 検索するキーワードをsearchパラメータとして保持し、それをもとに検索を行う
  const searchParams = useMemo(() => {
    const searchParam = router.query.search
    return Array.isArray(searchParam) ? searchParam : searchParam !== undefined ? [searchParam] : []
  }, [router.query.search])

  return (
    <div>
      <h1>Sakuga AI</h1>
      {searchParams.length > 0 && (
        <p>Search: {searchParams.join(', ')}</p>
      )}
    </div>
  );
}

export default Home;
