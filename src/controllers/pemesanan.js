// =========================
// 📦 IMPORT MODEL
// =========================
import { getMejaById, addPemesanan, getPemesananById,  updateStatusPemesanan, getAllPemesananWithPayment, deletePemesananById, getDetailFullPemesanan, getDetailStrukModel } from '../models/pemesanan.js';

import { getAllMetodePembayaran } from '../models/metode_pembayaran.js';

import { addDetailPemesanan, getDetailItemPemesanan } from '../models/detail_pemesanan.js';
import { addPembayaran, getPembayaranByPemesananId, updateStatusPembayaran, updateStatusPembayaranAdmin } from '../models/pembayaran.js';
import midtransClient from 'midtrans-client';
import Meja from '../models/meja.js';

// Setup Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// =========================
// 🔍 Ambil meja berdasarkan ID
// =========================
export const ambilMejaById = (req, res) => {
  const id_meja = req.params.id_meja;

  getMejaById(id_meja, (err, meja) => {
    if (err) {
      console.error('Gagal mengambil data meja:', err);
      return res.status(500).json({ message: 'Gagal mengambil data meja' });
    }

    if (!meja) {
      return res.status(404).json({ message: 'Meja tidak ditemukan' });
    }

    res.status(200).json({
      message: 'Data meja berhasil diambil',
      data: meja,
    });
  });
};

// =========================
// 🔍 Ambil semua metode pembayaran
// =========================
export const ambilSemuaMetodePembayaran = async (req, res) => {
  try {
    console.log('🔍 Mengambil data metode pembayaran...');

    // ✅ PAKAI AWAIT KARENA MODEL RETURN PROMISE
    const result = await getAllMetodePembayaran();
    console.log('✅ Data metode pembayaran:', result);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('❌ Gagal mengambil metode pembayaran:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data metode pembayaran',
      error: err.message,
    });
  }
};

// =========================
// 🛒 Tambah Pemesanan + Detail + Pembayaran
// =========================
export const tambahPemesananLengkap = async (req, res) => {
  try {
    const { nama_pelanggan, no_meja, tanggal_pemesanan, total_harga, detail_menu, id_metode } = req.body;

    // 1️⃣ Buat pemesanan
    const id_pemesanan = await addPemesanan({
      nama_pelanggan,
      no_meja,
      tanggal_pemesanan,
      total_harga,
      status_pemesanan: 'menunggu_pembayaran',
    });

    // 2️⃣ Detail pemesanan
    await Promise.all(
      detail_menu.map((item) =>
        addDetailPemesanan({
          id_pemesanan,
          id_menu: item.id_menu,
          jumlah: item.qty,
          subtotal: item.qty * item.harga,
          catatan: item.catatan,
        })
      )
    );

    /* =====================================================
       🔥 JIKA BAYAR DI KASIR
    ===================================================== */
    if (id_metode === 2) {
      await addPembayaran({
        id_pemesanan,
        id_metode,
        jumlah_bayar: total_harga,
        order_id: null,
        status_pembayaran: 'belum_bayar',
        redirect_url: null,
        midtrans_response: null,
      });

      return res.json({
        success: true,
        metode: 'kasir',
        id_pemesanan,
        status_pembayaran: 'belum_bayar',
      });
    }

    /* =====================================================
       🔥 JIKA QRIS (MIDTRANS)
    ===================================================== */
    if (id_metode === 1) {
      const order_id = `ORDER-${Date.now()}-${id_pemesanan}`;

      const transaction = await snap.createTransaction({
        transaction_details: {
          order_id,
          gross_amount: parseInt(total_harga),
        },
        callbacks: {
          finish: `https://frontend-basecamp.vercel.app//struk/${id_pemesanan}`,
        },
      });

      let redirect_url = transaction.redirect_url;

      // Optional: direct QRIS
      if (transaction.token) {
        redirect_url = `https://app.sandbox.midtrans.com/snap/v4/redirection/${transaction.token}#/other-qris`;
      }

      await addPembayaran({
        id_pemesanan,
        id_metode,
        jumlah_bayar: total_harga,
        order_id,
        status_pembayaran: 'belum_bayar',
        redirect_url,
        midtrans_response: null,
      });

      return res.json({
        success: true,
        metode: 'qris',
        id_pemesanan,
        order_id,
        redirect_url,
        status_pembayaran: 'belum_bayar',
      });
    }

    // ❌ Jika metode tidak valid
    return res.status(400).json({
      success: false,
      message: 'Metode pembayaran tidak valid',
    });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal tambah pemesanan',
      error: err.message,
    });
  }
};

// 🔄 WEBHOOK MIDTRANS - SESUAIKAN ENUM
// controllers/pemesananController.js - PERBAIKI fungsi midtransWebhook
// export const midtransWebhook = async (req, res) => {
//   try {
//     const payload = req.body;
//     const { order_id, transaction_status } = payload;

//     console.log('🔄 Webhook Midtrans:', {
//       order_id,
//       status: transaction_status,
//       timestamp: new Date().toISOString()
//     });

//     // Default value
//     let status_pembayaran = 'belum_bayar';
//     let status_pemesanan = 'menunggu_pembayaran';

//     // 1️⃣ Ambil data pembayaran berdasarkan order_id
//     const pembayaran = await getPembayaranByOrderId(order_id);
//     if (!pembayaran) {
//       console.error(`❌ Pembayaran tidak ditemukan untuk order_id: ${order_id}`);
//       return res.status(200).json({ 
//         success: false, 
//         message: 'Pembayaran tidak ditemukan' 
//       });
//     }

//     const idPemesanan = pembayaran.id_pemesanan;

//     // 2️⃣ Ambil data pemesanan
//     const pemesanan = await getPemesananById(idPemesanan);
//     if (!pemesanan) {
//       console.error(`❌ Pemesanan tidak ditemukan untuk id: ${idPemesanan}`);
//       return res.status(200).json({ 
//         success: false, 
//         message: 'Pemesanan tidak ditemukan' 
//       });
//     }

//     console.log('📊 Data ditemukan:', {
//       pembayaran_status: pembayaran.status_pembayaran,
//       pemesanan_status: pemesanan.status_pemesanan,
//       no_meja: pemesanan.no_meja
//     });

//     // 3️⃣ Tentukan aksi berdasarkan status Midtrans
//     switch (transaction_status) {
//       case 'capture':
//       case 'settlement':
//         status_pembayaran = 'sudah_bayar';
//         status_pemesanan = 'dikonfirmasi';

//         // Update status meja → terisi
//         if (pemesanan.no_meja) {
//           await updateStatusMeja(pemesanan.no_meja, 'terisi');
//           console.log(`✅ Meja ${pemesanan.no_meja} -> terisi`);
//         }

//         // Update status pemesanan → dikonfirmasi
//         await updateStatusPemesanan(idPemesanan, 'dikonfirmasi');
//         console.log(`💰 Pembayaran sukses untuk ${order_id}`);
//         break;

//       // ✅ TAMBAHKAN CASE 'pending' YANG HILANG!
//       case 'pending':
//         status_pembayaran = 'pending';
//         status_pemesanan = 'menunggu_pembayaran';
//         console.log(`⏳ Pembayaran pending untuk ${order_id}`);
//         break;

//       case 'expire':
//       case 'deny':
//       case 'cancel':
//       case 'failure':
//         status_pembayaran = 'dibatalkan';
//         status_pemesanan = 'dibatalkan';

//         // Update status pemesanan → dibatalkan
//         await updateStatusPemesanan(idPemesanan, 'dibatalkan');
//         console.log(`❌ Pembayaran dibatalkan untuk ${order_id}`);
//         break;

//       default:
//         console.log('⚠ Status Midtrans tidak dikenali:', transaction_status);
//         // Tetap update dengan status default
//         status_pembayaran = 'belum_bayar';
//         status_pemesanan = 'menunggu_pembayaran';
//         break;
//     }

//     // 4️⃣ Update data pembayaran (status + payload Midtrans)
//     console.log(`🔄 Updating pembayaran: ${order_id} -> ${status_pembayaran}`);
    
//     // PERBAIKAN: Sesuaikan dengan fungsi model yang sudah diperbaiki
//     await updateStatusPembayaran(order_id, status_pembayaran, payload);

//     console.log(`✅ Update berhasil: ${order_id} -> ${status_pembayaran}`);

//     // 5️⃣ Reply OK (MIDTRANS WAJIB TERIMA 200)
//     return res.status(200).json({
//       success: true,
//       message: 'Webhook processed successfully',
//       order_id: order_id,
//       status_pembayaran: status_pembayaran,
//       status_pemesanan: status_pemesanan,
//       timestamp: new Date().toISOString()
//     });
//   } catch (err) {
//     console.error('❌ Webhook error:', err);
//     console.error('Error details:', {
//       message: err.message,
//       sql: err.sql,
//       code: err.code,
//       stack: err.stack
//     });

//     // Tetap return 200 agar Midtrans TIDAK retry tanpa henti
//     return res.status(200).json({
//       success: false,
//       message: 'Webhook error (handled gracefully)',
//       error: err.message,
//       timestamp: new Date().toISOString()
//     });
//   }
// };

// 🔍 GET STATUS PEMBAYARAN - SESUAIKAN DENGAN MODEL BARU
export const getStatusPembayaran = async (req, res) => {
  try {
    const { id_pemesanan } = req.params;
    console.log('🔍 Checking payment status for pemesanan:', id_pemesanan);

    const pembayaran = await getPembayaranByPemesananId(id_pemesanan);

    if (!pembayaran) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran tidak ditemukan',
      });
    }

    let latest_status = pembayaran.status_pembayaran;

    try {
      const statusResponse = await snap.transaction.status(pembayaran.order_id);
      console.log('🔄 Latest status from Midtrans:', statusResponse.transaction_status);

      if (statusResponse.transaction_status === 'settlement') {
        latest_status = 'sudah_bayar'; // ✅ SESUAI ENUM
      } else if (statusResponse.transaction_status === 'pending') {
        latest_status = 'belum_bayar'; // ✅ SESUAI ENUM
      } else if (statusResponse.transaction_status === 'expire' || statusResponse.transaction_status === 'cancel' || statusResponse.transaction_status === 'deny') {
        latest_status = 'dibatalkan'; // ✅ SESUAI ENUM
      }

      if (latest_status !== pembayaran.status_pembayaran) {
        await updateStatusPembayaran(pembayaran.order_id, latest_status, statusResponse);
      }
    } catch (statusError) {
      if (statusError.httpStatusCode === 404) {
        console.warn('⚠️ Transaction not found in Midtrans for order:', pembayaran.order_id);
        console.log('ℹ️ Keeping existing status from database:', pembayaran.status_pembayaran);
      } else {
        console.log('⚠️ Other Midtrans error:', statusError.message);
      }
    }

    const response = {
      success: true,
      status_pembayaran: latest_status,
      redirect_url: pembayaran.redirect_url, // ✅ GANTI: qr_url → redirect_url
      order_id: pembayaran.order_id,
      id_pemesanan: pembayaran.id_pemesanan,
    };

    res.json(response);
  } catch (err) {
    console.error('❌ Error in getStatusPembayaran:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal ambil status',
      error: err.message,
    });
  }
};

export const getDetailStruk = async (req, res) => {
  const { id_pemesanan } = req.params;

  try {
    const data = await getDetailStrukModel(id_pemesanan);
    if (!data) return res.status(404).json({ message: 'Pemesanan tidak ditemukan' });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// =========================
// Get all pemesanan with payment info
// =========================
export const getListPemesanan = async (req, res) => {
  try {
    const data = await getAllPemesananWithPayment();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Hapus pemesanan berdasarkan ID
// =========================
export const hapusPemesanan = (req, res) => {
  const { id_pemesanan } = req.params;

  deletePemesananById(id_pemesanan, (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal menghapus' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pemesanan tidak ditemukan' });
    }

    res.json({ message: 'Pemesanan berhasil dihapus' });
  });
};

// =========================
// ✅ Dapatkan pemesanan
// =========================
export const getDetailPemesanan = async (req, res) => {
  try {
    const { id_pemesanan } = req.params;

    const info = await getDetailFullPemesanan(id_pemesanan);
    const items = await getDetailItemPemesanan(id_pemesanan);

    res.json({
      pemesanan: info,
      items: items,
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

export const updatePemesanan = async (req, res) => {
  const { id_pemesanan } = req.params;
  const { status_pemesanan, status_pembayaran } = req.body;

  try {
    const existing = await getPemesananById(id_pemesanan);
    if (!existing) {
      return res.status(404).json({ message: 'Pemesanan tidak ditemukan' });
    }

    // Update status pemesanan
    await updateStatusPemesanan(id_pemesanan, status_pemesanan);

    // Update status pembayaran jika ada
    if (status_pembayaran) {
      await updateStatusPembayaranAdmin(id_pemesanan, status_pembayaran);
    }
    if (status_pemesanan === 'dikonfirmasi') {
      await Meja.update(existing.no_meja, { status_meja: 'terisi' });
    }

    else if (status_pemesanan === 'selesai') {
      await Meja.update(existing.no_meja, { status_meja: 'tersedia' });
    }

    else if (status_pemesanan === 'dibatalkan') {
      await Meja.update(existing.no_meja, { status_meja: 'tersedia' });
    }

    res.status(200).json({
      message: 'Pemesanan berhasil diperbarui',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Gagal update pemesanan', error });
  }
};
