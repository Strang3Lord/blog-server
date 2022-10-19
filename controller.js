import asyncHandler from 'express-async-handler'
import { User, Blog } from './model.js'
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, 'gumgumcandy', {
    expiresIn: '30d',
  })
}
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (blog) {
    res.json(blog)
  } else {
    res.status(404)
    throw new Error('Blog not found')
  }
})

const getBlogs = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword

  const blogs = await Blog.find({ heading: new RegExp(keyword, 'i') })
  const keywordblogs = await Blog.find({ keywords: new RegExp(keyword, 'i') })

  res.json(Object.assign(blogs, keywordblogs))
})

const getBlogsWithKeywords = asyncHandler(async (req, res) => {
  const { keyword } = req.body

  const blogs = await Blog.find({ heading: new RegExp(keyword, 'i') })
  const keywordblogs = await Blog.find({ keywords: new RegExp(keyword, 'i') })

  res.json(Object.assign(blogs, keywordblogs))
})

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (blog) {
    await blog.remove()
    res.json({ message: 'Blog removed' })
  } else {
    res.status(404)
    throw new Error('Blog not found')
  }
})

const createBlog = asyncHandler(async (req, res) => {
  const { heading, blogdata, keywords } = req.body

  const blog = new Blog({
    heading: heading,
    blogdata: blogdata,
    keywords: keywords,
    category: 'Sample category',
    numComment: 0,
  })

  const createdBlog = await blog.save()
  res.status(201).json(createdBlog)
})

const createBlogComment = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const blog = await Blog.findById(req.params.id)

  if (blog) {
    const comment = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    blog.comment.push(comment)

    blog.numComment = blog.comments.length

    blog.rating =
      blog.comments.reduce((acc, item) => item.rating + acc, 0) /
      blog.comments.length

    await blog.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('blog not found')
  }
})

export {
  createBlog,
  deleteBlog,
  getBlogById,
  authUser,
  getBlogs,
  getBlogsWithKeywords,
  createBlogComment,
}
