import express from 'express';
import {
  getCitizenDashboard,
  getAdminDashboard,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/citizen', protect, getCitizenDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

export default router;
