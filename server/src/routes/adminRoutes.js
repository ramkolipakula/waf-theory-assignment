import express from 'express';
import {
  getIssues,
  updateIssueStatus,
  updateIssueDepartment,
} from '../controllers/issueController.js';
import {
  getAdminDashboard,
  getAdminAnalytics,
} from '../controllers/dashboardController.js';
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply auth and admin-only authorization to all admin endpoints
router.use(protect, authorize('admin'));

// Admin issue management
router.get('/issues', getIssues);
router.patch('/issues/:id/status', updateIssueStatus);
router.patch('/issues/:id/department', updateIssueDepartment);

// Admin analytics & metrics
router.get('/dashboard', getAdminDashboard);
router.get('/analytics', getAdminAnalytics);

// Admin department management
router.post('/departments', createDepartment);
router.patch('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

export default router;
