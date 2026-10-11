import { create } from 'zustand'
import { blogService } from '../services/api'

const useBlogStore = create((set) => ({
  posts: [],
  recentPosts: [],
  currentPost: null,
  categories: [],
  total: 0,
  page: 1,
  loading: false,

  fetchPosts: async (params = {}) => {
    set({ loading: true })
    try {
      const res = await blogService.getAll(params)
      set({ posts: res.data.data, total: res.data.total, page: res.data.page, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchRecent: async (count = 3) => {
    try {
      const res = await blogService.getRecent(count)
      set({ recentPosts: res.data })
    } catch { /* silent */ }
  },

  fetchBySlug: async (slug) => {
    set({ loading: true, currentPost: null })
    try {
      const res = await blogService.getBySlug(slug)
      set({ currentPost: res.data, loading: false })
    } catch {
      set({ loading: false })
    }
  },
}))

export default useBlogStore