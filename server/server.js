import app from './src/app.js'
import { env } from './src/config/env.js'
import { connectDB } from './src/config/db.js'

await connectDB()

const server = app.listen(env.port, () => {
  console.log(`✅ Server running in ${env.nodeEnv} mode on port ${env.port}`)
})

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})