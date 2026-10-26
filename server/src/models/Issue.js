import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    changedByName: {
      type: String,
      default: 'System Administrator',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed issue description'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select an issue category'],
      enum: [
        'Garbage & Sanitation',
        'Road Damage & Potholes',
        'Streetlights',
        'Water Leakage',
        'Drainage & Sewage',
        'Public Infrastructure',
        'Other',
      ],
      index: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Reported',
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location or street address'],
      trim: true,
    },
    neighborhood: {
      type: String,
      required: [true, 'Please specify a neighborhood'],
      trim: true,
      index: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    statusHistory: [statusHistorySchema],
    resolutionNotes: {
      type: String,
      default: '',
      trim: true,
    },
    supporters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    supportCount: {
      type: Number,
      default: 0,
      index: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate referenceId before save if not present
issueSchema.pre('save', function (next) {
  if (!this.referenceId) {
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    this.referenceId = `CC-${randomHex}`;
  }
  if (this.supporters) {
    this.supportCount = this.supporters.length;
  }
  next();
});

// Text search index for title, description, and location
issueSchema.index({ title: 'text', description: 'text', location: 'text', neighborhood: 'text' });

export const Issue = mongoose.model('Issue', issueSchema);
