const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config({ path: path.join(__dirname, "../.env") });

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cv_maker_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Buat pool koneksi ke database target
const pool = mysql.createPool(dbConfig);

/**
 * Fungsi untuk menginisialisasi database dan tabel secara otomatis jika belum ada.
 * Berguna saat pertama kali menjalankan sistem di XAMPP tanpa perlu impor manual.
 */
async function initDatabase() {
  let initialConn;
  try {
    // 1. Hubungkan dulu tanpa database spesifik untuk memastikan database ada
    initialConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true,
    });

    await initialConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );

    // 2. Baca file skema SQL
    const schemaPath = path.join(__dirname, "../database/schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, "utf-8");
      await initialConn.query(schemaSql);
      
      // Pastikan kolom dan tabel sudah termutakhirkan
      try {
        await initialConn.query(`USE \`${dbConfig.database}\`;`);
        
        // Pastikan kolom plan_status ada di users
        try {
          await initialConn.query(`ALTER TABLE users ADD COLUMN plan_status ENUM('free', 'pro') DEFAULT 'free';`);
        } catch (_) {}
        try {
          await initialConn.query(`UPDATE users SET plan_status = 'free' WHERE plan_status IS NULL OR plan_status = '';`);
        } catch (_) {}

        // Pastikan kolom payment_proof dan admin_notes ada di transactions
        try {
          await initialConn.query(`ALTER TABLE transactions ADD COLUMN payment_proof VARCHAR(255) NULL;`);
        } catch (_) {}

        try {
          await initialConn.query(`ALTER TABLE transactions ADD COLUMN admin_notes TEXT NULL;`);
        } catch (_) {}

        // Pastikan akun default Admin ada (email: admin@cvmaker.com, password: password123, role: admin)
        await initialConn.query(`
          INSERT INTO users (name, email, password, role, plan_status)
          VALUES ('Administrator ProCV', 'admin@cvmaker.com', '$2b$10$wUaX2XN0zRlhvG784s/Ope5Z0PcmqjPzFwzK2oKjY8h/5G8jZzH.S', 'admin', 'pro')
          ON DUPLICATE KEY UPDATE role = 'admin', plan_status = 'pro';
        `);
      } catch (alterErr) {
        console.warn("[Database Warning] Penyesuaian kolom/admin:", alterErr.message);
      }
      
      console.log(`[Database] Database '${dbConfig.database}' dan tabel berhasil disiapkan.`);
    }

    return true;
  } catch (error) {
    console.error("[Database Error] Gagal inisialisasi database MySQL:", error.message);
    return false;
  } finally {
    if (initialConn) {
      await initialConn.end();
    }
  }
}

/**
 * Cek status koneksi ke MySQL pool
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Terhubung ke MySQL server (${dbConfig.host}:${dbConfig.port}) - DB: ${dbConfig.database}`);
    connection.release();
    return true;
  } catch (error) {
    console.warn(`[Database Warning] Belum dapat terhubung ke MySQL: ${error.message}`);
    console.warn("[Petunjuk] Pastikan MySQL di XAMPP Control Panel sudah dalam status START (Running).");
    return false;
  }
}

module.exports = {
  pool,
  initDatabase,
  testConnection,
};
