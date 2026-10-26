import { Comment } from '../models/Comment.js';
import { Issue } from '../models/Issue.js';

// @desc    Get all comments for an issue
// @route   GET /api/issues/:id/comments
// @access  Public
export const getCommentsByIssue = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify issue exists
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Civic issue not found.',
      });
    }

    const comments = await Comment.find({ issue: id })
      .populate('author', 'name role neighborhood')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to an issue
// @route   POST /api/issues/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty.',
      });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Civic issue not found.',
      });
    }

    const comment = await Comment.create({
      issue: id,
      author: req.user._id,
      content: content.trim(),
    });

    // Update comment count on issue
    issue.commentsCount = await Comment.countDocuments({ issue: id });
    await issue.save();

    await comment.populate('author', 'name role neighborhood');

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully.',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Author or Admin)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
      });
    }

    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment.',
      });
    }

    const issueId = comment.issue;
    await comment.deleteOne();

    // Recalculate comments count
    const count = await Comment.countDocuments({ issue: issueId });
    await Issue.findByIdAndUpdate(issueId, { commentsCount: count });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
