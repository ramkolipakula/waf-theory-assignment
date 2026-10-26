import express from 'express';
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  supportIssue,
  removeSupport,
} from '../controllers/issueController.js';
import {
  getCommentsByIssue,
  addComment,
} from '../controllers/commentController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public / optional auth listing & single retrieval
router.get('/', optionalAuth, getIssues);
router.get('/:id', optionalAuth, getIssueById);

// Create issue (with multer upload)
router.post('/', protect, upload.single('image'), createIssue);

// Update / delete issue
router.patch('/:id', protect, upload.single('image'), updateIssue);
router.delete('/:id', protect, deleteIssue);

// Community Support
router.post('/:id/support', protect, supportIssue);
router.delete('/:id/support', protect, removeSupport);

// Issue Comments
router.get('/:id/comments', getCommentsByIssue);
router.post('/:id/comments', protect, addComment);

export default router;
