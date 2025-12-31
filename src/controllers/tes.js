// controllers/testController.js
import { 
  getPembayaranByOrderId, 
  updateStatusPembayaran 
} from '../models/pembayaran.js';

import { 
  getPemesananById, 
  updateStatusPemesanan, 
  updateStatusMeja 
} from '../models/pemesanan.js';

export const simulatePaymentSuccess = async (req, res) => {
  const { order_id } = req.body;

  try {
    // 1️⃣ Ambil pembayaran berdasarkan order_id
    const pembayaran = await getPembayaranByOrderId(order_id);
    if (!pembayaran) {
      return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    }

    // 2️⃣ Ambil data pemesanan
    const pemesanan = await getPemesananById(pembayaran.id_pemesanan);
    if (!pemesanan) {
      return res.status(404).json({ success: false, message: 'Pemesanan tidak ditemukan' });
    }

    // 3️⃣ Dummy response seolah dari Midtrans
    const dummyResponse = {
      transaction_status: "settlement",
      payment_type: "qris",
      transaction_time: new Date().toISOString(),
      gross_amount: pembayaran.jumlah_bayar || 0,
      simulated: true
    };

    // 4️⃣ Update status pembayaran → sudah bayar
    await updateStatusPembayaran(
      order_id,
      "sudah_bayar",
      pembayaran.jumlah_bayar,    // ← INI YANG HARUS ADA!
      dummyResponse
    );

    // 5️⃣ Update status pemesanan → dikonfirmasi
    await updateStatusPemesanan(pembayaran.id_pemesanan, "dikonfirmasi");

    // 6️⃣ Update status meja → terisi
    if (pemesanan.no_meja) {
      await updateStatusMeja(pemesanan.no_meja, "terisi");
    }

    // 7️⃣ Selesai
    res.json({
      success: true,
      message: "Simulasi pembayaran berhasil (settlement)",
      order_id,
      midtrans_response: dummyResponse
    });

  } catch (err) {
    console.error("❌ Simulate Payment Error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal simulasi pembayaran",
      error: err.message
    });
  }
};

