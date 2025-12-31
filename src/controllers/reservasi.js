import { addReservasi, getAllReservasiWithPayment, deleteReservasiById, getDetailReservasi, getDetailItemReservasi, updateReservasiModel } from '../models/reservasi.js';
import { addPemesanan } from '../models/pemesanan.js';
import { addDetailPemesanan } from '../models/detail_pemesanan.js';
import { addPembayaran, updateStatusPembayaranAdmin } from '../models/pembayaran.js';
import midtransClient from 'midtrans-client';
import Meja from '../models/meja.js';

// Setup Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const addReservasiLengkap = async (req, res) => {
  try {
    const { tanggal_dibuat, tanggal_reservasi, jam_reservasi, nama_pelanggan, no_meja, nomor_whatsapp, detail_menu, id_metode, total_harga } = req.body;

    // 1️⃣ Simpan reservasi
    const id_reservasi = await addReservasi({
      tanggal_dibuat,
      tanggal_reservasi,
      jam_reservasi,
      nama_pelanggan,
      no_meja,
      nomor_whatsapp,
      status_reservasi: 'menunggu_pembayaran',
    });

    // 2️⃣ Simpan pemesanan, ikutkan id_reservasi
    const id_pemesanan = await addPemesanan({
      nama_pelanggan: nama_pelanggan,
      no_meja: no_meja,
      tanggal_pemesanan: tanggal_dibuat,
      total_harga,
      status_pemesanan: 'menunggu_pembayaran',
      id_reservasi, // link ke reservasi
    });

    // 3️⃣ Simpan detail menu
    await Promise.all(
      detail_menu.map((item) =>
        addDetailPemesanan({
          id_pemesanan,
          id_menu: item.id_menu,
          jumlah: item.qty,
          subtotal: item.qty * item.harga,
          catatan: item.catatan || null,
        })
      )
    );

    // 4️⃣ Simpan pembayaran
    if (id_metode === 2) {
      // Bayar di kasir
      await addPembayaran({
        id_pemesanan,
        id_metode,
        jumlah_bayar: total_harga,
        order_id: null,
        status_pembayaran: 'belum_bayar',
        redirect_url: null,
        midtrans_response: null,
      });

      return res.json({ success: true, metode: 'kasir', id_pemesanan });
    }

    if (id_metode === 1) {
      // QRIS → Midtrans
      const order_id = `ORDER-${Date.now()}-${id_pemesanan}`;
      const transaction = await snap.createTransaction({
        transaction_details: { order_id, gross_amount: parseInt(total_harga) },
        callbacks: { finish: `http://localhost:5173/struk/${id_pemesanan}` },
      });

      const redirect_url = transaction.token ? `https://app.sandbox.midtrans.com/snap/v4/redirection/${transaction.token}#/other-qris` : transaction.redirect_url;

      await addPembayaran({
        id_pemesanan,
        id_metode,
        jumlah_bayar: total_harga,
        order_id,
        status_pembayaran: 'belum_bayar',
        redirect_url,
        midtrans_response: null,
      });

      return res.json({ success: true, metode: 'qris', id_pemesanan, redirect_url, order_id });
    }

    return res.status(400).json({ success: false, message: 'Metode pembayaran tidak valid' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal tambah reservasi + pemesanan', error: err.message });
  }
};

export const getListReservasi = async (req, res) => {
  try {
    const data = await getAllReservasiWithPayment();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const hapusReservasi = async (req, res) => {
  try {
    const { id_reservasi } = req.params;
    const result = await deleteReservasiById(id_reservasi);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
    }

    res.json({ message: 'Reservasi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDetailByReservasi = async (req, res) => {
  try {
    const { id_reservasi } = req.params;

    const info = await getDetailReservasi(id_reservasi);
    const items = await getDetailItemReservasi(id_reservasi);

    res.json({
      reservasi: info,
      items: items,
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

export const updateReservasi = async (req, res) => {
  try {
    const { id_reservasi } = req.params;
    const {
      tanggal_reservasi,
      jam_reservasi,
      status_reservasi,
      status_pembayaran,
    } = req.body;

    if (!tanggal_reservasi || !jam_reservasi) {
      return res.status(400).json({
        message: 'Tanggal dan jam reservasi wajib diisi',
      });
    }

    // 1️⃣ Ambil detail reservasi
    const reservasi = await getDetailReservasi(id_reservasi);
    if (!reservasi) {
      return res.status(404).json({
        message: 'Reservasi tidak ditemukan',
      });
    }

    const { id_pemesanan, no_meja } = reservasi;

    // 2️⃣ Update reservasi
    await updateReservasiModel(id_reservasi, {
      tanggal_reservasi,
      jam_reservasi,
      status_reservasi,
    });

    // 3️⃣ Update status pembayaran (jika ada pemesanan)
    if (status_pembayaran && id_pemesanan) {
      await updateStatusPembayaranAdmin(
        id_pemesanan,
        status_pembayaran
      );
    }

    // 4️⃣ Update status meja (AMAN)
    if (status_reservasi === 'selesai' && no_meja) {
      await Meja.update(no_meja, {
        status_meja: 'tersedia',
      });
    }

    if (status_reservasi === 'dibatalkan' && no_meja) {
      await Meja.update(no_meja, {
        status_meja: 'tersedia',
      });
    }

    if (status_reservasi === 'dikonfirmasi' && no_meja) {
      await Meja.update(no_meja, {
        status_meja: 'terisi',
      });
    }

    res.json({
      message: 'Reservasi berhasil diperbarui',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Gagal update reservasi',
      error: err.message,
    });
  }
};

