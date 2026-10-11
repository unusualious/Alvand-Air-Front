import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"
import useBlogStore from "../../stores/blogStore"

export default function HeroSection() {
  const { recentPosts, fetchRecent } = useBlogStore()

  useEffect(() => { fetchRecent(3) }, [])

  if (!recentPosts.length) return null

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 special-title relative">
              تازه ترین اخبار و رویدادها
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              تازه ها از دنیای هواپیمایی
            </p>
          </div>
          <Link
            to="/blog"
            className="flex items-center gap-1 text-gray-600 text-sm font-bold hover:gap-2 transition-all"
          >
            مشاهده همه
            <ArrowLeft size={16} />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.id}
              className="group overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition duration-500 hover:-translate-y-2 block"
            >
              <div className="overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-[280px] w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-7">
                <div className="flex items-center gap-2">
                  {post.categoryName && (
                    <span className="text-xs bg-red-50 text-[#a51c20] px-2.5 py-1 rounded-full font-bold">
                      {post.categoryName}
                    </span>
                  )}
                  <p className="text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                  </p>
                </div>

                <h3 className="mt-4 text-xl font-bold leading-relaxed transition line-clamp-2">
                  {post.title}
                </h3>

                <span className="mt-6 inline-block transition group-hover:translate-x-1 text-sm text-gray-600">
                  ادامه مطلب ←
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}