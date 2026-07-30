// One-time script: deletes ALL users and creates a single fresh admin
// with a properly hashed password (via User model's pre('save') hook).
//// Run with: npm run reset-admin
//
// Edit the ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD constants below
// before running.

import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
//admin user or password
const ADMIN_NAME = 'Talha'
const ADMIN_EMAIL = 'talha1@gmail.com'
const ADMIN_PASSWORD = 'Zelegance@2026Secure' 


async function run() {
  await connectDB()

  const { deletedCount } = await User.deleteMany({})
  console.log(`🗑️  Deleted ${deletedCount} user(s)`)

  // Use .create() (not insertMany) so the pre('save') hash hook runs
  const admin = await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    authProvider: 'local',
    role: 'admin',
    isEmailVerified: true,
  })

  console.log('✅ Fresh admin created:')
  console.log(`   email: ${admin.email}`)
  console.log(`   password (plain, for your reference only): ${ADMIN_PASSWORD}`)

  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error('❌ Reset failed:', err)
  process.exit(1)
})
