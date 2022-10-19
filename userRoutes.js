import express from 'express'
const router = express.Router()
import asyncHandler from 'express-async-handler'
import { admin, protect } from './authMiddleware.js'
import { authUser } from './controller.js'

router.post('/login', authUser)

// router
//   .route('/:id')
//   .delete(protect, admin, deleteUser)
//   .get(protect, admin, getUserById)

export default router
