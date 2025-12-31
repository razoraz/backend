import express from 'express';
import { midtransWebhook } from '../controllers/webhook.js';

const router = express.Router();
router.post('/midtrans-webhook', midtransWebhook);




export default router;
