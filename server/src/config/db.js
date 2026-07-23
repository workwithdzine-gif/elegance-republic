import mongoose from 'mongoose'
import dns from 'dns'
import { env } from './env.js'

dns.setServers(['8.8.8.8', '8.8.4.4'])

export async function connectDB() {
  if (!env.mongoUri) {
    console.error('❌ MONGO_URI is missing in .env file')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(env.mongoUri)
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`)
    process.exit(1)
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected')
  })
}