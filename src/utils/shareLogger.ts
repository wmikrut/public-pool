import { createPool } from 'mysql2/promise';

const shareQueue: any[] = [];
const FLUSH_INTERVAL_MS = 3000;
const MAX_BATCH_SIZE = 100;

const pool = createPool({
  host: '192.168.1.231',
  user: 'wmikrut',
  password: 'niles08',
  database: 'public_pool',
  waitForConnections: true,
  connectionLimit: 10
});

// Kick off table creation at startup
ensureSharesTableExists().catch(console.error);

export function logShare(share: any) {
  shareQueue.push(share);
}

async function ensureSharesTableExists() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS shares (
      id INT AUTO_INCREMENT PRIMARY KEY,
      coin_symbol VARCHAR(16),
      worker VARCHAR(100),
      job_id VARCHAR(64),
      difficulty FLOAT,
      extra_nonce1 VARCHAR(32),
      extra_nonce2 VARCHAR(32),
      ntime VARCHAR(16),
      nonce VARCHAR(16),
      version VARCHAR(16),
      accepted BOOLEAN,
      description VARCHAR(255),
      timestamp DATETIME
    );
  `;
  try {
    await pool.query(createTableSQL);
    console.log('✅ shares table verified or created.');
  } catch (err) {
    console.error('❌ Failed to verify or create shares table:', err);
  }
}


setInterval(async () => {
  if (shareQueue.length === 0) return;

  const batch = shareQueue.splice(0, MAX_BATCH_SIZE);

  const sql = `
    INSERT INTO shares
    (coin_symbol, worker, job_id, difficulty, extra_nonce1, extra_nonce2, ntime, nonce, version, accepted, description, timestamp)
    VALUES ?
  `;

  const values = batch.map(s => [
    s.coin_symbol, s.worker, s.job_id, s.difficulty, s.extra_nonce1, s.extra_nonce2,
    s.ntime, s.nonce, s.version, s.accepted, s.description ?? null,s.timestamp,
  ]);

  try {
    await pool.query(sql, [values]);
    console.log(`Inserted ${values.length} share logs`);
  } catch (err) {
    console.error('MySQL insert error:', err);
    shareQueue.unshift(...batch); // retry later
  }
}, FLUSH_INTERVAL_MS);
