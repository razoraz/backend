import authRoutes from './routes/admin-route.js';
import menuRoutes from './routes/menu-route.js';
import reservasiRoutes from './routes/reservasi-route.js';
import pemesananRoutes from './routes/pemesanan-route.js';
import mejaRoutes from './routes/meja-route.js';
import statisRoutes from './routes/statistik-route.js';
import feedbackRoutes from './routes/feedback-route.js';
import berandaRoutes from './routes/beranda-route.js';
import eventRoutes from './routes/event-route.js';
import laporanRoutes from './routes/laporan-route.js';
import berandaPelangganRoutes from './routes/berandaPelanggan-route.js';
import webhookRoutes from './routes/webhook-route.js';

export const initRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/menu', menuRoutes);
  app.use('/api/pemesanan', pemesananRoutes);
  app.use('/api/meja', mejaRoutes);
  app.use('/api/statistik', statisRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/reservasi', reservasiRoutes);
  app.use('/api/beranda', berandaRoutes);
  app.use('/api/event', eventRoutes);
  app.use('/api/laporan', laporanRoutes);
  app.use('/api/beranda-pelanggan', berandaPelangganRoutes);
  app.use('/api/webhook', webhookRoutes);
};
