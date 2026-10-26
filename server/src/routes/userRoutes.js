import express from 'express';
import { getMyIssues } from '../controllers/issueController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me/issues', protect, getMyIssues);

export default router;
