const { initDatabase, testConnection } = require("../config/db");

async function run() {
  console.log("Memulai proses inisialisasi database MySQL XAMPP...");
  const initialized = await initDatabase();
  if (initialized) {
    console.log("Inisialisasi tabel database sukses!");
    await testConnection();
    process.exit(0);
  } else {
    console.error("Gagal melakukan inisialisasi. Pastikan modul MySQL di XAMPP sudah berjalan.");
    process.exit(1);
  }
}

run();
