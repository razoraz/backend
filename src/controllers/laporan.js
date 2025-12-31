import ExcelJS from 'exceljs';
import { getLaporanPemesanan, getLaporanReservasi } from '../models/laporan.js';

// ==========================
// Download Laporan Pemesanan
// ==========================
export const downloadLaporanPemesanan = async (req, res) => {
  try {
    const { range } = req.params; // 'hari', 'minggu', 'bulan', 'tahun'
    const data = await getLaporanPemesanan(range);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Pemesanan');

    // Header
    sheet.columns = [
      { header: 'Tanggal Pemesanan', key: 'tanggal_pemesanan', width: 20 },
      { header: 'Nama Pelanggan', key: 'nama_pelanggan', width: 25 },
      { header: 'No Meja', key: 'no_meja', width: 10 },
      { header: 'Menu + Jumlah', key: 'daftar_menu', width: 30 },
      { header: 'Total Harga', key: 'total_harga', width: 15 },
      { header: 'Status Pemesanan', key: 'status_pemesanan', width: 20 },
      { header: 'Metode Pembayaran', key: 'metode_pembayaran', width: 20 },
      { header: 'Status Pembayaran', key: 'status_pembayaran', width: 20 },
    ];

    // Rows
    data.forEach((row) => {
      sheet.addRow({
        tanggal_pemesanan: row.tanggal_pemesanan,
        nama_pelanggan: row.nama_pelanggan,
        no_meja: row.no_meja,
        daftar_menu: row.daftar_menu, // format: Menu1 x2, Menu2 x1
        total_harga: row.total_harga,
        status_pemesanan: row.status_pemesanan,
        metode_pembayaran: row.metode_pembayaran,
        status_pembayaran: row.status_pembayaran,
      });
    });

    // Style header
    sheet.getRow(1).font = { bold: true };

    // Kirim file
    res.setHeader('Content-Disposition', `attachment; filename=laporan_pemesanan_${range}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal download laporan', error: err.message });
  }
};

// ==========================
// Download Laporan Reservasi
// ==========================
export const downloadLaporanReservasi = async (req, res) => {
  try {
    const { range } = req.params;
    const data = await getLaporanReservasi(range);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reservasi');

    // Header
    sheet.columns = [
      { header: 'Tanggal Dibuat', key: 'tanggal_dibuat', width: 20 },
      { header: 'Tanggal Reservasi', key: 'tanggal_reservasi', width: 20 },
      { header: 'Jam Reservasi', key: 'jam_reservasi', width: 15 },
      { header: 'Nama Pelanggan', key: 'nama_pelanggan', width: 25 },
      { header: 'No Meja', key: 'no_meja', width: 10 },
      { header: 'Nomor WhatsApp', key: 'nomor_whatsapp', width: 20 },
      { header: 'Menu + Jumlah', key: 'daftar_menu', width: 30 },
      { header: 'Total Harga', key: 'total_harga', width: 15 },
      { header: 'Status Reservasi', key: 'status_reservasi', width: 20 },
      { header: 'Metode Pembayaran', key: 'metode_pembayaran', width: 20 },
      { header: 'Status Pembayaran', key: 'status_pembayaran', width: 20 },
    ];

    // Rows
    data.forEach((row) => {
      sheet.addRow({
        tanggal_dibuat: row.tanggal_dibuat,
        tanggal_reservasi: row.tanggal_reservasi,
        jam_reservasi: row.jam_reservasi,
        nama_pelanggan: row.nama_pelanggan,
        no_meja: row.no_meja,
        nomor_whatsapp: row.nomor_whatsapp,
        daftar_menu: row.daftar_menu, // format: Menu1 x2, Menu2 x1
        total_harga: row.total_harga,
        status_reservasi: row.status_reservasi,
        metode_pembayaran: row.metode_pembayaran,
        status_pembayaran: row.status_pembayaran,
      });
    });

    // Style header
    sheet.getRow(1).font = { bold: true };

    // Kirim file
    res.setHeader('Content-Disposition', `attachment; filename=laporan_reservasi_${range}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal download laporan', error: err.message });
  }
};
