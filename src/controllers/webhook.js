import { getPembayaranByOrderId, updateStatusPembayaran } from '../models/pembayaran.js';
import { getPemesananById, updateStatusPemesanan } from '../models/pemesanan.js';
import { getReservasiById, updateStatusReservasi } from '../models/reservasi.js';
import Meja from '../models/meja.js';

export const midtransWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const { order_id, transaction_status } = payload;

    console.log('🔔 Midtrans Webhook:', order_id, transaction_status);

    // 1️⃣ Cari pembayaran
    const pembayaran = await getPembayaranByOrderId(order_id);
    if (!pembayaran) {
      console.warn('⚠ Pembayaran tidak ditemukan');
      return res.status(200).json({ success: false });
    }

    // 2️⃣ Ambil pemesanan
    const pemesanan = await getPemesananById(pembayaran.id_pemesanan);
    if (!pemesanan) {
      console.warn('⚠ Pemesanan tidak ditemukan');
      return res.status(200).json({ success: false });
    }

    // Status default
    let status_pembayaran = 'belum_bayar';
    let status_pemesanan = 'menunggu_pembayaran';
    let status_reservasi = 'menunggu_pembayaran';
    
    const today = new Date().toISOString().split('T')[0];

    // 3️⃣ Mapping status Midtrans
    switch (transaction_status) {
      case 'capture':
      case 'settlement':
        status_pembayaran = 'sudah_bayar';
        
        // PERBEDAAN LOGIKA BERDASARKAN ADA/TIDAK RESERVASI
        if (pemesanan.id_reservasi) {
          // 🔵 ADA RESERVASI (booking meja + order makanan)
          status_reservasi = 'menunggu_konfirmasi';
          status_pemesanan = 'dikonfirmasi';
          
          // Cek apakah reservasi untuk hari ini atau masa depan
          const reservasi = await getReservasiById(pemesanan.id_reservasi);
          if (reservasi) {
            const isToday = reservasi.tanggal_reservasi === today;
            const mejaStatus = isToday ? 'terisi' : 'dipesan';
            
            if (reservasi.no_meja) {
              await Meja.update(reservasi.no_meja, { status_meja: mejaStatus });
            }
          }
        } else {
          // 🔴 TANPA RESERVASI (langsung datang, order makanan sekarang)
          status_pemesanan = 'dikonfirmasi';
          
          // Langsung pakai meja sekarang
          if (pemesanan.no_meja) {
            await Meja.update(pemesanan.no_meja, { status_meja: 'terisi' });
          }
        }
        break;

      case 'pending':
        status_pembayaran = 'belum_bayar';
        break;

      case 'expire':
      case 'deny':
      case 'cancel':
      case 'failure':
        status_pembayaran = 'dibatalkan';
        status_pemesanan = 'dibatalkan';
        
        if (pemesanan.id_reservasi) {
          // ADA RESERVASI: batal reservasi juga
          status_reservasi = 'dibatalkan';
        }
        
        // Kembalikan meja ke tersedia
        if (pemesanan.no_meja) {
          await Meja.update(pemesanan.no_meja, { status_meja: 'tersedia' });
        }
        break;
    }

    // 4️⃣ Update pembayaran
    await updateStatusPembayaran(order_id, status_pembayaran, payload);

    // 5️⃣ Update pemesanan
    await updateStatusPemesanan(pemesanan.id_pemesanan, status_pemesanan);

    // 6️⃣ Update reservasi (hanya jika ada)
    if (pemesanan.id_reservasi && status_reservasi) {
      await updateStatusReservasi(pemesanan.id_reservasi, status_reservasi);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Webhook Error:', err);
    return res.status(200).json({ success: false });
  }
};
