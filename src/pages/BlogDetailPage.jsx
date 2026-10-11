import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import useBlogStore from "../stores/blogStore"
import { Calendar, Eye, ArrowLeft, User } from "lucide-react"

function BlogDetailPage() {
  const { slug } = useParams()
  const { currentPost, loading, fetchBySlug } = useBlogStore()

  useEffect(() => { fetchBySlug(slug) }, [slug])

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-gray-200 border-t-[#a51c20] rounded-full animate-spin" />
    </div>
  )

  if (!currentPost) return (
    <div className="min-h-screen pt-24 text-center">
      <p className="text-gray-400">مقاله یافت نشد</p>
      <Link to="/blog" className="text-[#a51c20] font-bold mt-4 inline-block">بازگشت به مجله</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <article className="max-w-3xl mx-auto px-6">

        <Link to="/blog" className="flex items-center gap-1 text-gray-500 text-sm mb-6 hover:gap-2 transition-all">
          <ArrowLeft size={15} className="rotate-180" /> بازگشت به مجله
        </Link>

        {currentPost.categoryName && (
          <span className="text-xs bg-red-50 text-[#a51c20] px-3 py-1.5 rounded-full font-bold">
            {currentPost.categoryName}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-4 mb-5 leading-relaxed">
          {currentPost.title}
        </h1>

        <div className="flex items-center gap-5 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          {currentPost.authorName && (
            <span className="flex items-center gap-1.5"><User size={14} /> {currentPost.authorName}</span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {new Date(currentPost.createdAt).toLocaleDateString('fa-IR')}
          </span>
          <span className="flex items-center gap-1.5"><Eye size={14} /> {currentPost.viewCount} بازدید</span>
        </div>

        <img
          src={currentPost.coverImage}
          alt={currentPost.title}
          className="w-full h-80 md:h-96 object-cover rounded-[34px] mb-10"
        />

        <div className="prose prose-lg max-w-none text-gray-700 leading-loose whitespace-pre-line">
          {currentPost.content}
        </div>
      </article>
    </div>
  )
}

export default BlogDetailPage