-- BUAT DATABASE
CREATE DATABASE db_basecamp;
USE db_basecamp;

-- CREATE TABEL
-- TABEL ADMIN
CREATE TABLE admin (
  id_admin INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255) NOT NULL,
  kode_admin VARCHAR(20) NOT NULL
)
;
-- TABEL KATEGORI MENU
CREATE TABLE kategori_menu (
  id_kategori INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori VARCHAR(50) NOT NULL
)
-- TABEL MENU
CREATE TABLE menu (
  id_menu INT AUTO_INCREMENT PRIMARY KEY,
  id_kategori INT NOT NULL,
  nama_menu VARCHAR(100) UNIQUE NOT NULL,
  deskripsi TEXT,
  harga DECIMAL(10,2) NOT NULL,
  gambar_menu VARCHAR(255),
  status ENUM('tersedia','habis') NOT NULL DEFAULT 'tersedia',
  FOREIGN KEY (id_kategori) REFERENCES kategori_menu(id_kategori) ON DELETE RESTRICT 
);
-- TABEL MEJA
CREATE TABLE meja (
  id_meja INT AUTO_INCREMENT PRIMARY KEY,
  no_meja INT UNIQUE NOT NULL,
  kapasitas INT NOT NULL,
  status_meja ENUM('tersedia', 'dipesan', 'terisi') NOT NULL DEFAULT 'Tersedia'
);

-- TABEL METODE PEMBAYARAN
CREATE TABLE metode_pembayaran (
    id_metode INT AUTO_INCREMENT PRIMARY KEY,
    nama_metode VARCHAR(50) NOT NULL
);

-- TABEL RESERVASI
CREATE TABLE reservasi (
    id_reservasi INT AUTO_INCREMENT PRIMARY KEY,
    tanggal_dibuat DATE NOT NULL,
    tanggal_reservasi DATE NOT NULL,
    jam_reservasi TIME NOT NULL,
    nama_pelanggan VARCHAR(100) NOT NULL,
    no_meja INT NOT NULL,
    nomor_whatsapp VARCHAR(15) NOT NULL,
    status_reservasi ENUM('menunggu_pembayaran', 'dikonfirmasi', 'selesai', 'dibatalkan'),
    FOREIGN KEY (no_meja) REFERENCES meja(no_meja) ON DELETE CASCADE
);
-- TABEL PEMESANAN
CREATE TABLE pemesanan (
  id_pemesanan INT AUTO_INCREMENT PRIMARY KEY,
  tanggal_pemesanan DATE NOT NULL,
  nama_pelanggan VARCHAR(255) NOT NULL,
  id_reservasi INT NULL,
  no_meja INT NOT NULL,
  total_harga DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status_pemesanan ENUM('menunggu_pembayaran','dikonfirmasi','selesai','dibatalkan') DEFAULT 'menunggu_pembayaran',
  FOREIGN KEY (id_reservasi) REFERENCES reservasi(id_reservasi) ON DELETE CASCADE,
  FOREIGN KEY (no_meja) REFERENCES meja(no_meja) ON DELETE CASCADE
);

-- TABEL DETAIL PEMESANAN
CREATE TABLE detail_pemesanan (
  id_detail INT AUTO_INCREMENT PRIMARY KEY,
  id_pemesanan INT NOT NULL,
  id_menu INT NOT NULL,
  jumlah INT NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  catatan TEXT,
  FOREIGN KEY (id_pemesanan) REFERENCES pemesanan(id_pemesanan) ON DELETE CASCADE,
  FOREIGN KEY (id_menu) REFERENCES menu(id_menu) ON DELETE CASCADE
);

-- TABEL PEMBAYARAN
CREATE TABLE pembayaran (
  id_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
  id_pemesanan INT NOT NULL,
  id_metode INT NOT NULL,
  id_admin INT NULL,
  jumlah_bayar DECIMAL(12,2) NULL,
  waktu_bayar DATETIME NULL,
  order_id VARCHAR(255) NULL,
  redirect_url TEXT NULL,
  status_pembayaran ENUM('belum_bayar', 'sudah_bayar', 'dibatalkan') DEFAULT 'belum_bayar',
  midtrans_response JSON NULL,
  FOREIGN KEY (id_admin) REFERENCES admin(id_admin) ON DELETE CASCADE,
  FOREIGN KEY (id_pemesanan) REFERENCES pemesanan(id_pemesanan) ON DELETE CASCADE,
  FOREIGN KEY (id_metode) REFERENCES metode_pembayaran(id_metode) ON DELETE CASCADE
);

CREATE TABLE feedback (
  id_feedback INT AUTO_INCREMENT PRIMARY KEY,
  id_pemesanan INT,
  feedback TEXT NOT NULL,
  gambar_feedback VARCHAR(255),
  rating INT NOT NULL,
  tanggal_feedback DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_feedback_pemesanan
    FOREIGN KEY (id_pemesanan) REFERENCES pemesanan(id_pemesanan)
    ON DELETE CASCADE
);

CREATE TABLE event_bc (
  id_event INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  gambar_event VARCHAR(255) NOT NULL,
  tanggal TIMESTAMP 
    DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP
);



-- INSERT DATA
-- INSERT DATA ADMIN
INSERT INTO admin (email, password, kode_admin)
VALUES 
('admin1@basecamp.com', 'pass123', 'ADM001'),
('admin2@basecamp.com', 'pass456', 'ADM002');

-- INSERT DATA METODE PEMBAYARAN
INSERT INTO metode_pembayaran (nama_metode)
VALUES 
('QRIS Digital'),
('Tunai di Kasir');
