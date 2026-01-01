import { getPembayaranByOrderId, updateStatusPembayaran } from '../models/pembayaran.js';
import { getPemesananById, updateStatusPemesanan } from '../models/pemesanan.js';
import { updateReservasiModel } from '../models/reservasi.js';
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

    let status_pembayaran = 'belum_bayar';
    let status_reservasi = 'menunggu_pembayaran';
    let status_pemesanan = 'menunggu_pembayaran';

    // 3️⃣ Mapping status Midtrans
    switch (transaction_status) {
      case 'capture':
      case 'settlement':
        status_pembayaran = 'sudah_bayar';
        status_reservasi = 'dikonfirmasi';
        status_pemesanan = 'dikonfirmasi';

        if (pemesanan.no_meja) {
          await Meja.update(pemesanan.no_meja, { status_meja: 'dipesan' });
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
        status_reservasi = 'dibatalkan';
        status_pemesanan = 'dibatalkan';

        if (pemesanan.no_meja) {
          await Meja.update(pemesanan.no_meja, { status_meja: 'tersedia' });
        }
        break;
    }

    // 4️⃣ Update pembayaran
    await updateStatusPembayaran(order_id, status_pembayaran, payload);

    // 5️⃣ Update pemesanan
    await updateStatusPemesanan(pemesanan.id_pemesanan, status_pemesanan);

    // 6️⃣ Update reservasi (kalau ada)
    if (pemesanan.id_reservasi) {
      await updateReservasiModel(pemesanan.id_reservasi, status_reservasi);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Webhook Error:', err);
    return res.status(200).json({ success: false });
  }
};
