import * as dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';

const shareQueue: any[] = [];
const FLUSH_INTERVAL_MS = 3000;
const MAX_BATCH_SIZE = 100;

dotenv.config();

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Kick off table creation at startup
ensureBlocksTableExists().catch(console.error);

export async function ensureBlocksTableExists() {
  const sql = `
    CREATE TABLE IF NOT EXISTS blocks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      coin_symbol VARCHAR(16),
      height INT,
      hash VARCHAR(64),
      worker VARCHAR(100),
      difficulty FLOAT,
      reward DECIMAL(18,8),
      timestamp DATETIME
    )
  `;
  try {
    await pool.query(sql);
    console.log('✅ Blocks table ensured.');
  } catch (err) {
    console.error('❌ Failed to ensure blocks table:', err);
  }
}

export async function logBlock(block: {
  coin_symbol: string;
  height: number;
  hash: string;
  worker: string;
  difficulty: number;
  reward: number;
  timestamp: Date;
}) {
  const sql = `
    INSERT INTO blocks
    (coin_symbol, height, hash, worker, difficulty, reward, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    block.coin_symbol,
    block.height,
    block.hash,
    block.worker,
    block.difficulty,
    block.reward,
    block.timestamp,
  ];

  try {
    await pool.query(sql, values);
    console.log(`✅ Block ${block.hash} logged at height ${block.height}`);
  } catch (err) {
    console.error('❌ MySQL block insert error:', err);
  }
}