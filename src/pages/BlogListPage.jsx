import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import useBlogStore from "../stores/blogStore"
import { Calendar, Eye, ArrowLeft, Search } from "lucide-react"

function BlogListPage() {
  const { posts, total, loading, fetchPosts, categories } = useBlogStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState("")
  const page = Number(searchParams.get("page")) || 1
  const category = searchParams.get("category") || ""

  useEffect(() => {
    fetchPosts({ page, category, search: searchParams.get("search") || "" })
  }, [page, category])

  const handleSearch = () => {
    setSearchParams({ search, page: 1 })
    fetchPosts({ page: 1, search })
  }

  const pageSize = 9
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* هدر */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-3">مجله سفر الوند</h1>
          <p className="text-gray-500">راهنمای سفر، اخبار هوانوردی و مقاصد گردشگری</p>
        </div>

        {/* جستجو */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="جستجو در مقالات..."
            className="w-full border border-gray-200 rounded-2xl pr-11 pl-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#a51c20]/30 focus:border-[#a51c20] transition bg-white"
          />
        </div>

        {/* لیست مقالات */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-96 bg-gray-100 rounded-[34px] animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">مقاله‌ای یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link
                to={`/blog/${post.slug}`}
                key={post.id}
                className="group overflow-hidden rounded-[34px] border border-gray-100 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl block"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {post.categoryName && (
                      <span className="text-xs bg-red-50 text-[#a51c20] px-2.5 py-1 rounded-full font-bold">
                        {post.categoryName}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-relaxed line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{post.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-[#a51c20] font-bold group-hover:gap-2 transition-all">
                    ادامه مطلب <ArrowLeft size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* صفحه‌بندی */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setSearchParams({ page: p, category })}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition cursor-pointer ${
                  p === page ? 'bg-[#a51c20] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogListPage