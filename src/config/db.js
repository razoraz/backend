import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration untuk Railway
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // Tambahan untuk Railway/cloud database
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Railway biasanya butuh SSL
  } : undefined
};

const db = mysql.createPool(dbConfig);

// Test connection
db.getConnection()
  .then(conn => {
    console.log('✅ Connected to MySQL database');
    console.log(`📍 Host: ${dbConfig.host}`);
    console.log(`📍 Database: ${dbConfig.database}`);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.log('Current config:', {
      host: dbConfig.host,
      database: dbConfig.database,
      user: dbConfig.user,
      port: dbConfig.port
    });
  });

export default db;