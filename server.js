import express from 'express'
import { errorHandler, notFound } from './authMiddleware.js'
import connectDB from './db.js'
import dotenv from 'dotenv'
import path from 'path'
import blogRoutes from './blogRoutes.js'
import { authUser } from './controller.js'
import morgan from 'morgan'
import cors from 'cors'
import cloudinary from 'cloudinary'
import multer from 'multer'
import fs from 'fs'

dotenv.config()

connectDB()
const app = express()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.use('/blogs', blogRoutes)
app.use('/login', authUser)
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname)
  },
})
const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false)
  }
  cb(null, true)
}
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5000000 },
})
app.use('/upload', upload.single('file'), async (req, res, next) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'bloogie',
    })
    res.send(`${result.secure_url}`)
  } catch (error) {
    console.log(error)
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send({ API: 'sinfl' })
})

app.listen(4000, console.log(`server 4000`))
