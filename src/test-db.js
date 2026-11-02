import dotenv from 'dotenv';
import pool, { testConnection } from './config/db.js';

dotenv.config();

async function run() {
  console.log('====================================================');
  console.log('  Testing Connection to PostgreSQL: rajmuni_civil_pdf');
  console.log('====================================================');
  console.log(`Host:     ${process.env.DB_HOST || 'localhost'}`);
  console.log(`Port:     ${process.env.DB_PORT || '5432'}`);
  console.log(`Database: ${process.env.DB_NAME || 'rajmuni_civil_pdf'}`);
  console.log(`User:     ${process.env.DB_USER || 'postgres'}`);
  console.log(`Password: ${process.env.DB_PASSWORD ? '********' : '(not set)'}`);
  console.log('----------------------------------------------------');

  try {
    const info = await testConnection();
    console.log('✅ Connection Successful!');
    console.log(`Connected Database: ${info.database}`);
    console.log(`Connected User:     ${info.user}`);
    console.log(`PostgreSQL Engine:  ${info.version.split(' on ')[0]}`);
    console.log('----------------------------------------------------');

    // List all public tables
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    if (tablesRes.rows.length === 0) {
      console.log('ℹ️  No tables found in public schema yet. Ready for migrations/schemas!');
    } else {
      console.log(`📊 Found ${tablesRes.rows.length} table(s) in rajmuni_civil_pdf:`);
      for (const row of tablesRes.rows) {
        console.log(`   - ${row.table_name}`);
      }
    }
    console.log('====================================================');
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error(`Error Code:    ${error.code || 'UNKNOWN'}`);
    console.error(`Error Message: ${error.message}`);
    console.log('----------------------------------------------------');
    if (error.code === '28P01') {
      console.log('👉 Tip: Password authentication failed. Please update DB_PASSWORD in your .env file with your actual pgAdmin/PostgreSQL password.');
    } else if (error.code === '3D000') {
      console.log(`👉 Tip: Database "${process.env.DB_NAME}" does not exist. Verify the name in pgAdmin.`);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('👉 Tip: Connection refused. Ensure PostgreSQL service is running on the specified host and port.');
    }
    console.log('====================================================');
  } finally {
    await pool.end();
  }
}

run();
