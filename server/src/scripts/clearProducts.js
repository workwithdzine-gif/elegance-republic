import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import Product from '../models/Product.js'

async function run() {
  await connectDB()

  const { deletedCount } = await Product.deleteMany({})
  console.log(`🗑️  Deleted ${deletedCount} products. Categories were left untouched.`)

  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error('❌ Clear failed:', err)
  process.exit(1)
})