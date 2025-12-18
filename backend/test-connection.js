import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

console.log('🔍 Testing MongoDB Atlas connection...');
console.log('URI exists:', !!MONGO_URI);

if (!MONGO_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB Atlas connection successful!');
    console.log('📊 Database name:', mongoose.connection.name);
    console.log('🌐 Connection state:', mongoose.connection.readyState);
    
    // Create a test collection to verify write access
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    return TestModel.create({ test: 'Connection test' });
  })
  .then(() => {
    console.log('✅ Write test successful - database is working!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection failed:');
    console.error('Error message:', err.message);
    
    if (err.message.includes('authentication')) {
      console.error('🔐 Authentication failed - check username/password');
    } else if (err.message.includes('network')) {
      console.error('🌐 Network error - check internet connection');
    } else if (err.message.includes('timeout')) {
      console.error('⏰ Connection timeout - check network access in MongoDB Atlas');
    }
    
    process.exit(1);
  });