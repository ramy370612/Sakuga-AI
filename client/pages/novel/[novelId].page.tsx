import type { NovelBodyEntity } from 'api/@types/novel';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { apiClient } from 'utils/apiClient';

const Home = () => {
  const [novelBody, setNovelBody] = useState<NovelBodyEntity | null>(null)
  const router = useRouter();

  // `/novel/123234` -> `123234` のように、novelIdパラメータを取得
  // novelIdパラメータを取得し、それをもとに小説情報を取得する
  const novelId = useMemo(() => {
    const novelIdParam = router.query.novelId;
    return Array.isArray(novelIdParam) ? novelIdParam[0] : novelIdParam ?? '';
  }, [router.query.novelId]);

  useEffect(() => {
    const fetchNovelData = async () => {
      const res = await apiClient.novels.body.$get({ query: { id: novelId } });
      return res
    }

    fetchNovelData().then(setNovelBody);
    return () => setNovelBody(null);
  }, [novelId])

  return (
    <div>
      <h1>Sakuga AI</h1>
      <h2>Novel</h2>
      <p>Novel ID: {novelId}</p>
    </div>
  );
};

export default Home;
