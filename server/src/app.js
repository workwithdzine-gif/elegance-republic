import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'

import { env, isProd } from './config/env.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

// --- Security & core middleware ---
app.use(helmet())
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
)
app.use(compression())
app.use(express.json({ limit: '10kb' })) // body size limit — prevents payload abuse
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())
app.use(mongoSanitize()) // strips $ and . from user input — prevents NoSQL injection

if (!isProd) {
  app.use(morgan('dev'))
}

// --- Global rate limiter (extra limiters added on sensitive routes like login later) ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
})
app.use(globalLimiter)

// --- Health check (useful for uptime monitors / deployment platforms) ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Z Elegance API is running', env: env.nodeEnv })
})

// --- Routes ---
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/users', userRoutes)

// --- 404 + error handler (must stay LAST) ---
app.use(notFound)
app.use(errorHandler)

export default app
