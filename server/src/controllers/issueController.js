import { Issue } from '../models/Issue.js';
import { Department } from '../models/Department.js';
import { Comment } from '../models/Comment.js';

// Category to Department name mapping for automated recommendation
const CATEGORY_DEPT_MAP = {
  'Garbage & Sanitation': 'Sanitation Department',
  'Road Damage & Potholes': 'Roads & Public Works',
  'Streetlights': 'Electrical Department',
  'Water Leakage': 'Water Board',
  'Drainage & Sewage': 'Drainage & Sewerage Department',
  'Public Infrastructure': 'Public Infrastructure Department',
  'Other': 'Public Infrastructure Department',
};

// @desc    Get all public issues with filtering, search, sorting & pagination
// @route   GET /api/issues
// @access  Public (Optional Auth)
export const getIssues = async (req, res, next) => {
  try {
    const {
      search,
      category,
      status,
      neighborhood,
      severity,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by neighborhood
    if (neighborhood && neighborhood !== 'All') {
      query.neighborhood = neighborhood;
    }

    // Filter by severity
    if (severity && severity !== 'All') {
      query.severity = severity;
    }

    // Search query across title, description, and location
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { neighborhood: searchRegex },
        { referenceId: searchRegex },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'mostSupported') {
      sortOptions = { supportCount: -1, createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalIssues = await Issue.countDocuments(query);

    const issues = await Issue.find(query)
      .populate('reporter', 'name neighborhood')
      .populate('assignedDepartment', 'name code')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Calculate userHasSupported if user is authenticated
    const currentUserId = req.user?._id?.toString();
    const enrichedIssues = issues.map((issue) => {
      const obj = issue.toObject();
      obj.userHasSupported = currentUserId
        ? issue.supporters.some((s) => s.toString() === currentUserId)
        : false;
      return obj;
    });

    res.status(200).json({
      success: true,
      count: enrichedIssues.length,
      total: totalIssues,
      totalPages: Math.ceil(totalIssues / limitNum),
      currentPage: pageNum,
      data: enrichedIssues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single issue by ID or referenceId
// @route   GET /api/issues/:id
// @access  Public (Optional Auth)
export const getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let issue;
    if (id.startsWith('CC-')) {
      issue = await Issue.findOne({ referenceId: id });
    } else {
      issue = await Issue.findById(id);
    }

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Civic issue report not found.',
      });
    }

    await issue.populate('reporter', 'name neighborhood email phone createdAt');
    await issue.populate('assignedDepartment', 'name code contactEmail contactPhone headOfDepartment');

    const currentUserId = req.user?._id?.toString();
    const obj = issue.toObject();
    obj.userHasSupported = currentUserId
      ? issue.supporters.some((s) => s.toString() === currentUserId)
      : false;

    res.status(200).json({
      success: true,
      data: obj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new civic issue report
// @route   POST /api/issues
// @access  Private (Citizen or Admin)
export const createIssue = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      severity = 'Medium',
      location,
      neighborhood,
      latitude,
      longitude,
      imageUrl,
    } = req.body;

    if (!title || !description || !category || !location || !neighborhood) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, location, and neighborhood.',
      });
    }

    // Collect images
    const images = [];
    if (req.file) {
      images.push(`/uploads/${req.file.filename}`);
    }
    if (imageUrl && imageUrl.trim()) {
      images.push(imageUrl.trim());
    }

    // Fallback default image by category if none provided
    if (images.length === 0) {
      const defaultCategoryPhotos = {
        'Garbage & Sanitation': 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
        'Road Damage & Potholes': 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        'Streetlights': 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80',
        'Water Leakage': 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
        'Drainage & Sewage': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        'Public Infrastructure': 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
        'Other': 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
      };
      images.push(defaultCategoryPhotos[category] || defaultCategoryPhotos['Other']);
    }

    // Suggest and assign department automatically based on category
    let assignedDepartmentId = null;
    const targetDeptName = CATEGORY_DEPT_MAP[category];
    if (targetDeptName) {
      const dept = await Department.findOne({ name: targetDeptName });
      if (dept) {
        assignedDepartmentId = dept._id;
      }
    }

    const issue = new Issue({
      title: title.trim(),
      description: description.trim(),
      category,
      severity,
      images,
      location: location.trim(),
      neighborhood: neighborhood.trim(),
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      reporter: req.user._id,
      assignedDepartment: assignedDepartmentId,
      status: 'Reported',
      statusHistory: [
        {
          status: 'Reported',
          changedBy: req.user._id,
          changedByName: req.user.name,
          timestamp: new Date(),
          notes: 'Civic complaint report logged by citizen.',
        },
      ],
    });

    await issue.save();

    await issue.populate('reporter', 'name neighborhood');
    if (assignedDepartmentId) {
      await issue.populate('assignedDepartment', 'name code');
    }

    res.status(201).json({
      success: true,
      message: 'Civic issue report submitted successfully.',
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update civic issue report
// @route   PATCH /api/issues/:id
// @access  Private (Citizen can edit own only if Reported; Admin can edit any)
export const updateIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Civic issue report not found.',
      });
    }

    const isOwner = issue.reporter.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this issue report.',
      });
    }

    // Strict rule: Citizens can only edit reports that are still in 'Reported' status
    if (isOwner && !isAdmin && issue.status !== 'Reported') {
      return res.status(400).json({
        success: false,
        message: `Report cannot be modified once it has been '${issue.status}' by municipal authorities.`,
      });
    }

    const { title, description, category, severity, location, neighborhood, latitude, longitude, imageUrl } = req.body;

    if (title) issue.title = title.trim();
    if (description) issue.description = description.trim();
    if (category) issue.category = category;
    if (severity) issue.severity = severity;
    if (location) issue.location = location.trim();
    if (neighborhood) issue.neighborhood = neighborhood.trim();
    if (latitude !== undefined) issue.latitude = latitude ? parseFloat(latitude) : null;
    if (longitude !== undefined) issue.longitude = longitude ? parseFloat(longitude) : null;

    if (req.file) {
      issue.images.unshift(`/uploads/${req.file.filename}`);
    } else if (imageUrl) {
      issue.images.unshift(imageUrl.trim());
    }

    await issue.save();
    await issue.populate('reporter', 'name neighborhood');
    await issue.populate('assignedDepartment', 'name code');

    res.status(200).json({
      success: true,
      message: 'Civic issue updated successfully.',
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or withdraw issue report
// @route   DELETE /api/issues/:id
// @access  Private (Citizen can withdraw own only if Reported; Admin can delete any)
export const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Civic issue report not found.',
      });
    }

    const isOwner = issue.reporter.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this issue report.',
      });
    }

    if (isOwner && !isAdmin && issue.status !== 'Reported') {
      return res.status(400).json({
        success: false,
        message: `Report cannot be withdrawn once it has reached '${issue.status}' status. Please contact municipal support.`,
      });
    }

    // Remove related comments
    await Comment.deleteMany({ issue: issue._id });
    await issue.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Civic issue report successfully deleted/withdrawn.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Support an issue
// @route   POST /api/issues/:id/support
// @access  Private (Authenticated Citizen/Admin)
export const supportIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Civic issue report not found.',
      });
    }

    const userId = req.user._id;
    const hasSupported = issue.supporters.some((s) => s.toString() === userId.toString());

    if (hasSupported) {
      return res.status(400).json({
        success: false,
        message: 'You have already supported this community report.',
        supportCount: issue.supportCount,
        userHasSupported: true,
      });
    }

    issue.supporters.push(userId);
    issue.supportCount = issue.supporters.length;
    await issue.save();

    res.status(200).json({
      success: true,
      message: 'Support added to civic issue.',
      supportCount: issue.supportCount,
      userHasSupported: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove support from an issue
// @route   DELETE /api/issues/:id/support
// @access  Private
export const removeSupport = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Civic issue report not found.',
      });
    }

    const userId = req.user._id;
    const initialLength = issue.supporters.length;
    issue.supporters = issue.supporters.filter((s) => s.toString() !== userId.toString());

    if (issue.supporters.length === initialLength) {
      return res.status(400).json({
        success: false,
        message: 'You have not previously supported this issue.',
        supportCount: issue.supportCount,
        userHasSupported: false,
      });
    }

    issue.supportCount = issue.supporters.length;
    await issue.save();

    res.status(200).json({
      success: true,
      message: 'Support removed from civic issue.',
      supportCount: issue.supportCount,
      userHasSupported: false,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's submitted reports
// @route   GET /api/users/me/issues
// @access  Private
export const getMyIssues = async (req, res, next) => {
  try {
    const { status, category, search, sort = 'newest' } = req.query;
    const query = { reporter: req.user._id };

    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.category = category;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }, { location: regex }, { referenceId: regex }];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'mostSupported') sortOption = { supportCount: -1 };

    const issues = await Issue.find(query)
      .populate('assignedDepartment', 'name code')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update issue status with timeline note
// @route   PATCH /api/admin/issues/:id/status
// @access  Private (Admin only)
export const updateIssueStatus = async (req, res, next) => {
  try {
    const { status, notes, resolutionNotes } = req.body;

    const allowedStatuses = ['Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Civic issue report not found.',
      });
    }

    const previousStatus = issue.status;
    issue.status = status;

    if (resolutionNotes) {
      issue.resolutionNotes = resolutionNotes.trim();
    }

    // Append to status history
    issue.statusHistory.push({
      status,
      changedBy: req.user._id,
      changedByName: req.user.name,
      timestamp: new Date(),
      notes: notes?.trim() || `Status updated from ${previousStatus} to ${status} by Municipal Admin.`,
    });

    await issue.save();
    await issue.populate('reporter', 'name email neighborhood');
    await issue.populate('assignedDepartment', 'name code');

    res.status(200).json({
      success: true,
      message: `Issue status successfully updated to '${status}'.`,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Assign or update department
// @route   PATCH /api/admin/issues/:id/department
// @access  Private (Admin only)
export const updateIssueDepartment = async (req, res, next) => {
  try {
    const { departmentId, notes } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Civic issue report not found.',
      });
    }

    let departmentName = 'Unassigned';
    if (departmentId) {
      const dept = await Department.findById(departmentId);
      if (!dept) {
        return res.status(404).json({
          success: false,
          message: 'Department not found.',
        });
      }
      issue.assignedDepartment = dept._id;
      departmentName = dept.name;
    } else {
      issue.assignedDepartment = null;
    }

    issue.statusHistory.push({
      status: issue.status,
      changedBy: req.user._id,
      changedByName: req.user.name,
      timestamp: new Date(),
      notes: notes?.trim() || `Department assigned to ${departmentName} by Municipal Admin.`,
    });

    await issue.save();
    await issue.populate('assignedDepartment', 'name code contactEmail headOfDepartment');

    res.status(200).json({
      success: true,
      message: `Department assigned to ${departmentName}.`,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};
