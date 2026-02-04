import fs from 'fs';
import path from 'path';
import pool from './index';

async function migrate() {
  const migrationPath = path.join(__dirname, '../../migrations/001_create_todos.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  try {
    await pool.query(sql);
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
