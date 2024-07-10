import { useRouter } from "next/router"
import { useMemo } from "react"

const Home = () => {
  const router = useRouter()

  // `/novel/123234` -> `123234` のように、novelIdパラメータを取得
  // novelIdパラメータを取得し、それをもとに小説情報を取得する
  const novelId = useMemo(() => {
    const novelIdParam = router.query.novelId
    return Array.isArray(novelIdParam) ? novelIdParam[0] : novelIdParam ?? ''
  }, [router.query.novelId])

  return (
    <div>
      <h1>Sakuga AI</h1>
      <h2>Novel</h2>
      <p>Novel ID: {novelId}</p>
    </div>
  )
}

export default Home
