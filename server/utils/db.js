import mongoose from 'mongoose'

export default async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogg'
    
    await mongoose.connect(MONGODB_URI)
    console.log('📦 MongoDB Connected!')
    return mongoose.connection
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}