import { Department } from '../models/Department.js';
import { Issue } from '../models/Issue.js';

// @desc    Get all municipal departments
// @route   GET /api/departments
// @access  Public
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isActive: true }).sort({ name: 1 });

    // Enhance departments with current issue counts
    const counts = await Issue.aggregate([
      {
        $group: {
          _id: '$assignedDepartment',
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $in: ['$status', ['Reported', 'Acknowledged', 'In Progress']] }, 1, 0],
            },
          },
        },
      },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      if (c._id) {
        countMap[c._id.toString()] = { total: c.total, active: c.active };
      }
    });

    const enriched = departments.map((d) => ({
      ...d.toObject(),
      totalIssues: countMap[d._id.toString()]?.total || 0,
      activeIssues: countMap[d._id.toString()]?.active || 0,
    }));

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new department
// @route   POST /api/admin/departments
// @access  Private (Admin only)
export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, categories, description, contactEmail, contactPhone, headOfDepartment } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Department name is required.',
      });
    }

    const dept = await Department.create({
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : name.substring(0, 3).toUpperCase(),
      categories: categories || [],
      description: description?.trim() || '',
      contactEmail: contactEmail?.trim() || '',
      contactPhone: contactPhone?.trim() || '',
      headOfDepartment: headOfDepartment?.trim() || '',
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      data: dept,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PATCH /api/admin/departments/:id
// @access  Private (Admin only)
export const updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    const { name, code, categories, description, contactEmail, contactPhone, headOfDepartment, isActive } = req.body;
    if (name) dept.name = name.trim();
    if (code) dept.code = code.trim().toUpperCase();
    if (categories) dept.categories = categories;
    if (description !== undefined) dept.description = description.trim();
    if (contactEmail !== undefined) dept.contactEmail = contactEmail.trim();
    if (contactPhone !== undefined) dept.contactPhone = contactPhone.trim();
    if (headOfDepartment !== undefined) dept.headOfDepartment = headOfDepartment.trim();
    if (isActive !== undefined) dept.isActive = isActive;

    await dept.save();

    res.status(200).json({
      success: true,
      message: 'Department updated successfully.',
      data: dept,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department
// @route   DELETE /api/admin/departments/:id
// @access  Private (Admin only)
export const deleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    // Unassign issues assigned to this department
    await Issue.updateMany({ assignedDepartment: dept._id }, { assignedDepartment: null });
    await dept.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
