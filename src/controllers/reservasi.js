import { addReservasi, getAllReservasiWithPayment, deleteReservasiById, getDetailReservasi, getDetailItemReservasi, updateReservasiModel } from '../models/reservasi.js';
import { addPemesanan, updateStatusPemesanan, updateStatusMeja } from '../models/pemesanan.js';
import { addDetailPemesanan } from '../models/detail_pemesanan.js';
import { addPembayaran, updateStatusPembayaranAdmin, getPembayaranWithMetode } from '../models/pembayaran.js';
import midtransClient from 'midtrans-client';


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
        callbacks: { finish: `https://frontend-basecamp.vercel.app/struk/${id_pemesanan}` },
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
  const { id_reservasi } = req.params;
  const {
    tanggal_reservasi,
    jam_reservasi,
    status_reservasi,
    status_pembayaran,
    id_admin, // ⭐ id_admin dari frontend
  } = req.body;

  console.log('📥 Request body updateReservasi:', req.body);
  console.log('👤 id_admin dari request:', id_admin);

  try {
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

    // 3️⃣ LOGIKA UNTUK id_admin HANYA JIKA:
    // - Ada status_pembayaran = 'sudah_bayar'
    // - Metode pembayaran = 'Tunai di Kasir'
    // - Ada id_admin dari request
    let adminIdUntukPembayaran = null;

    if (status_pembayaran && id_pemesanan) {
      // 🔎 Ambil metode pembayaran (sama seperti di updatePemesanan)
      // Asumsi: Anda punya fungsi getPembayaranWithMetode untuk reservasi juga
      const pembayaran = await getPembayaranWithMetode(id_pemesanan);
      console.log('💰 Metode pembayaran reservasi:', pembayaran?.nama_metode);

      // ⭐ LOGIKA: Hanya simpan id_admin jika tunai & sudah_bayar
      if (status_pembayaran === 'sudah_bayar' && pembayaran?.nama_metode === 'Tunai di Kasir' && id_admin) {
        adminIdUntukPembayaran = id_admin;
        console.log(`✅ Akan menyimpan id_admin: ${id_admin} untuk pembayaran tunai (reservasi)`);
      }

      // Update status pembayaran DENGAN id_admin
      await updateStatusPembayaranAdmin(
        id_pemesanan,
        status_pembayaran,
        adminIdUntukPembayaran // ⭐ null untuk QRIS, id_admin untuk tunai
      );
    }

    // 4️⃣ LOGIKA UPDATE STATUS MEJA:
    if (no_meja) {
      if (status_reservasi === 'menunggu_konfirmasi') {
        await updateStatusMeja(no_meja, 'dipesan');
        console.log(`✅ Meja ${no_meja} -> dipesan`);
      } else if (status_reservasi === 'menunggu_pembayaran') {
        await updateStatusMeja(no_meja, 'tersedia');
        console.log(`✅ Meja ${no_meja} -> tersedia`);
      } else if (status_reservasi === 'dikonfirmasi') {
        await updateStatusMeja(no_meja, 'terisi');
        console.log(`✅ Meja ${no_meja} -> terisi`);
      } else if (status_reservasi === 'selesai' || status_reservasi === 'dibatalkan') {
        await updateStatusMeja(no_meja, 'tersedia');
        console.log(`✅ Meja ${no_meja} -> tersedia`);
      }
    }

    // 5️⃣ Update pemesanan hanya jika status_reservasi adalah status yang ada di pemesanan
    if (id_pemesanan) {
      const statusMapping = {
        menunggu_pembayaran: 'menunggu_pembayaran',
        menunggu_konfirmasi: 'dikonfirmasi',
        dikonfirmasi: 'dikonfirmasi',
        selesai: 'selesai',
        dibatalkan: 'dibatalkan',
      };

      if (statusMapping[status_reservasi]) {
        await updateStatusPemesanan(id_pemesanan, statusMapping[status_reservasi]);
      }
    }

    res.json({
      message: 'Reservasi berhasil diperbarui',
      id_admin_dicatat: adminIdUntukPembayaran, // ⭐ Info ke frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Gagal update reservasi',
      error: err.message,
    });
  }
};
