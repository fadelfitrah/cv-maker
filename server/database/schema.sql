-- ========================================================
-- DATABASE SCHEMA UNTUK CV MAKER (XAMPP MYSQL)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `cv_maker_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `cv_maker_db`;

-- 1. TABEL USERS (Menampung pendaftaran/registrasi user & status plan)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `plan_status` ENUM('free', 'pro') DEFAULT 'free' COMMENT 'Status plan: free (hanya edit) vs pro (bisa download)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_plan` (`plan_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL CV_PROFILES (Menyimpan data pribadi & konten CV user)
CREATE TABLE IF NOT EXISTS `cv_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(150) DEFAULT 'Curriculum Vitae',
  `full_name` VARCHAR(150) NULL,
  `job_title` VARCHAR(150) NULL,
  `email` VARCHAR(150) NULL,
  `phone` VARCHAR(50) NULL,
  `location` VARCHAR(150) NULL,
  `website` VARCHAR(255) NULL,
  `linkedin` VARCHAR(255) NULL,
  `github` VARCHAR(255) NULL,
  `bio` TEXT NULL,
  `avatar_url` VARCHAR(255) NULL,
  `avatar_shape` VARCHAR(20) DEFAULT 'circle',
  `resume_data` LONGTEXT NULL COMMENT 'Menyimpan format JSON lengkap (pengalaman, pendidikan, skill, sertifikat, theme, dll)',
  `is_primary` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cv_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_cv_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABEL TRANSACTIONS (Menampung kegiatan transaksi user)
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `order_id` VARCHAR(60) NOT NULL UNIQUE,
  `plan_name` VARCHAR(100) NOT NULL COMMENT 'Paket langganan atau template berbayar yang dibeli',
  `amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) DEFAULT 'IDR',
  `status` ENUM('pending', 'paid', 'failed', 'cancelled') DEFAULT 'pending',
  `payment_method` VARCHAR(50) DEFAULT 'manual_transfer',
  `payment_details` TEXT NULL COMMENT 'JSON atau detail keterangan pembayaran',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_trx_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_trx_user_id` (`user_id`),
  INDEX `idx_trx_order_id` (`order_id`),
  INDEX `idx_trx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- CONTOH DATA SEED (OPSIONAL UNTUK PENGUJIAN)
-- Password default: 'password123'
-- ========================================================

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `plan_status`)
VALUES
  (1, 'Demo User (Free)', 'demo@cvmaker.com', '$2b$10$wUaX2XN0zRlhvG784s/Ope5Z0PcmqjPzFwzK2oKjY8h/5G8jZzH.S', 'user', 'free'),
  (2, 'Pro Member', 'pro@cvmaker.com', '$2b$10$wUaX2XN0zRlhvG784s/Ope5Z0PcmqjPzFwzK2oKjY8h/5G8jZzH.S', 'user', 'pro')
ON DUPLICATE KEY UPDATE `email` = `email`;
