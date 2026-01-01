import { getPembayaranByOrderId, updateStatusPembayaran } from '../models/pembayaran.js';
import { getPemesananById, updateStatusPemesanan, updateStatusMeja } from '../models/pemesanan.js';
import { updateStatusReservasi } from '../models/reservasi.js';

export const midtransWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const { order_id, transaction_status } = payload;

    console.log('🔔 Midtrans Webhook:', order_id, transaction_status);

    // 1️⃣ Cari pembayaran
    const pembayaran = await getPembayaranByOrderId(order_id);
    if (!pembayaran) {
      return res.status(200).json({ success: false });
    }

    // 2️⃣ Ambil pemesanan
    const pemesanan = await getPemesananById(pembayaran.id_pemesanan);
    if (!pemesanan) {
      return res.status(200).json({ success: false });
    }

    let status_pembayaran = 'belum_bayar';
    let status_pemesanan = 'menunggu_pembayaran';
    let status_reservasi = null; // ⬅️ PENTING

    switch (transaction_status) {
      case 'capture':
      case 'settlement':
        status_pembayaran = 'sudah_bayar';
        status_pemesanan = 'dikonfirmasi';

        if (pemesanan.id_reservasi) {
          // 🔵 ADA RESERVASI
          status_reservasi = 'menunggu_konfirmasi';

          if (pemesanan.no_meja) {
            await updateStatusMeja(pemesanan.no_meja, 'dipesan');
            console.log(`✅ Meja ${pemesanan.no_meja} -> dipesan`);
          }
        } else {
          // 🔴 TIDAK ADA RESERVASI (walk-in)
          if (pemesanan.no_meja) {
            await updateStatusMeja(pemesanan.no_meja, 'terisi');
            console.log(`✅ Meja ${pemesanan.no_meja} -> terisi`);
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
          status_reservasi = 'dibatalkan';
        }

        if (pemesanan.no_meja) {
          await updateStatusMeja(pemesanan.no_meja, 'tersedia');
          console.log(`❌ Meja ${pemesanan.no_meja} -> tersedia`);
        }
        break;
    }

    // 4️⃣ Update pembayaran
    await updateStatusPembayaran(order_id, status_pembayaran, payload);

    // 5️⃣ Update pemesanan
    await updateStatusPemesanan(pemesanan.id_pemesanan, status_pemesanan);

    // 6️⃣ Update reservasi (HANYA JIKA ADA & TIDAK NULL)
    if (pemesanan.id_reservasi && status_reservasi !== null) {
      await updateStatusReservasi(pemesanan.id_reservasi, status_reservasi);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Webhook Error:', err);
    return res.status(200).json({ success: false });
  }
};
