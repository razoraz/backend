import { getBerandaSummaryModel, getNotifikasiBerandaModel } from '../models/beranda.js';
export const getBerandaSummary = (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  console.log('Tanggal hari ini:', today);
  console.log('Tanggal kemarin:', yesterday);

  getBerandaSummaryModel(today, yesterday, (err, data) => {
    if (err) {
      console.error('Error di getBerandaSummaryModel:', err);
      return res.status(500).json({ message: 'Gagal ambil summary', error: err });
    }
    console.log('Summary berhasil:', data);
    res.json(data);
  });
};

export const getBerandaNotifications = (req, res) => {
  getNotifikasiBerandaModel((err, data) => {
    if (err) {
      console.error('Error di getNotifikasiBerandaModel:', err);
      return res.status(500).json({ message: 'Gagal ambil notifikasi' });
    }
    console.log('Notifikasi berhasil:', data);
    res.json(data);
  });
};
