import { Issue } from '../models/Issue.js';
import { Department } from '../models/Department.js';
import { User } from '../models/User.js';

// @desc    Get citizen personalized dashboard metrics
// @route   GET /api/dashboard/citizen
// @access  Private (Citizen)
export const getCitizenDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Aggregated counts for current citizen
    const [totalSubmitted, underReview, inProgress, resolved, rejected] = await Promise.all([
      Issue.countDocuments({ reporter: userId }),
      Issue.countDocuments({ reporter: userId, status: 'Reported' }),
      Issue.countDocuments({ reporter: userId, status: { $in: ['Acknowledged', 'In Progress'] } }),
      Issue.countDocuments({ reporter: userId, status: 'Resolved' }),
      Issue.countDocuments({ reporter: userId, status: 'Rejected' }),
    ]);

    // Recent 5 issues submitted by this user
    const recentReports = await Issue.find({ reporter: userId })
      .populate('assignedDepartment', 'name code')
      .sort({ createdAt: -1 })
      .limit(5);

    // Issues supported by user
    const supportedIssues = await Issue.find({ supporters: userId })
      .select('title category status neighborhood supportCount createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalSubmitted,
          underReview,
          inProgress,
          resolved,
          rejected,
        },
        recentReports,
        supportedIssues,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get municipal admin dashboard metrics & analytics
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
export const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalReports,
      reportedCount,
      acknowledgedCount,
      inProgressCount,
      resolvedCount,
      rejectedCount,
      criticalCount,
      totalCitizens,
      totalDepartments,
    ] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'Reported' }),
      Issue.countDocuments({ status: 'Acknowledged' }),
      Issue.countDocuments({ status: 'In Progress' }),
      Issue.countDocuments({ status: 'Resolved' }),
      Issue.countDocuments({ status: 'Rejected' }),
      Issue.countDocuments({ severity: 'Critical', status: { $ne: 'Resolved' } }),
      User.countDocuments({ role: 'citizen' }),
      Department.countDocuments({ isActive: true }),
    ]);

    const activeIssues = reportedCount + acknowledgedCount + inProgressCount;
    const resolutionRate = totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0;

    // Group issues by Category
    const categoryStats = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Group issues by Status
    const statusStats = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Group issues by Neighborhood
    const neighborhoodStats = await Issue.aggregate([
      { $group: { _id: '$neighborhood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Group issues by Severity
    const severityStats = await Issue.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    // Recent 6 reported issues for triage
    const recentIssues = await Issue.find()
      .populate('reporter', 'name email neighborhood')
      .populate('assignedDepartment', 'name code')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalReports,
          activeIssues,
          reportedCount,
          acknowledgedCount,
          inProgressCount,
          resolvedCount,
          rejectedCount,
          criticalCount,
          totalCitizens,
          totalDepartments,
          resolutionRate,
        },
        categoryStats: categoryStats.map((c) => ({ name: c._id, count: c.count })),
        statusStats: statusStats.map((s) => ({ name: s._id, count: s.count })),
        neighborhoodStats: neighborhoodStats.map((n) => ({ name: n._id, count: n.count })),
        severityStats: severityStats.map((s) => ({ name: s._id, count: s.count })),
        recentIssues,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed analytics for Recharts
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
export const getAdminAnalytics = async (req, res, next) => {
  try {
    // Category distribution
    const categoryAgg = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $in: ['$status', ['Reported', 'Acknowledged', 'In Progress']] }, 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Neighborhood breakdown
    const neighborhoodAgg = await Issue.aggregate([
      {
        $group: {
          _id: '$neighborhood',
          total: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ['$severity', 'Critical'] }, 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Status breakdown
    const statusAgg = await Issue.aggregate([
      { $group: { _id: '$status', value: { $sum: 1 } } },
    ]);

    // Severity breakdown
    const severityAgg = await Issue.aggregate([
      { $group: { _id: '$severity', value: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        categoryBreakdown: categoryAgg.map((c) => ({
          category: c._id,
          total: c.total,
          resolved: c.resolved,
          pending: c.pending,
        })),
        neighborhoodBreakdown: neighborhoodAgg.map((n) => ({
          neighborhood: n._id,
          total: n.total,
          resolved: n.resolved,
          critical: n.critical,
        })),
        statusDistribution: statusAgg.map((s) => ({
          name: s._id,
          value: s.value,
        })),
        severityDistribution: severityAgg.map((s) => ({
          name: s._id,
          value: s.value,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
