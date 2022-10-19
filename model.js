import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

const commentschema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const BlogSchema = mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, 'Blog Name is required'],
    },
    category: {
      type: String,
    },
    keywords: [
      {
        type: String,
      },
    ],
    blogdata: [
      {
        desc: String,
        code: String,
        image: String,
      },
    ],
    // descs: [
    //   {
    //     type: String,
    //   },
    // ],
    // keywords: [
    //   {
    //     type: String,
    //   },
    // ],
    // codes: [
    //   {
    //     type: String,
    //   },
    // ],
    // images: [
    //   {
    //     type: String,
    //   },
    // ],

    comments: [commentschema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numcomments: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Blog = mongoose.model('Blog', BlogSchema)

export { Blog, User }
