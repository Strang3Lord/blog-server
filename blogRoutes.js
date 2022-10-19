import express from 'express'

import { admin, protect } from './authMiddleware.js'
import {
  createBlog,
  createBlogComment,
  deleteBlog,
  getBlogById,
  getBlogs,
  getBlogsWithKeywords,
} from './controller.js'
const router = express.Router()

router.route('/').get(getBlogs).post(createBlog)
router.route('/searchwithkeywords').post(getBlogsWithKeywords)
router.route('/:id/reviews').post(protect, createBlogComment)

router.route('/:id').get(getBlogById).delete(protect, admin, deleteBlog)
//   .put(protect, admin, updateProduct)

export default router
