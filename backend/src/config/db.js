const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.DATABASE_URL);

let db;

async function connectDB() {
  await client.connect();
  db = client.db(); // Lấy tên DB từ URL tự động
  console.log('✅ Kết nối MongoDB thành công!');
  return db;
}

function getDB() {
  if (!db) {
    throw new Error('Database chưa được kết nối. Hãy gọi connectDB() trước.');
  }
  return db;
}

module.exports = { connectDB, getDB };
