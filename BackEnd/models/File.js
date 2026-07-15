const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  // Reference to GridFS file
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'uploads.files'
  },
  
  // User who uploaded
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // File Information
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true,
    unique: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileExtension: {
    type: String,
    default: ''
  },
  
  // Organization
  folder: {
    type: String,
    default: 'general',
    index: true
  },
  tags: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // Access Control
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    accessLevel: {
      type: String,
      enum: ['view', 'edit', 'delete'],
      default: 'view'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['uploading', 'processing', 'completed', 'failed'],
    default: 'uploading'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  
  // Analytics
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date
  },
  
  // Expiry
  expiresAt: {
    type: Date
  },
  
  // Additional Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for performance
fileSchema.index({ userId: 1, folder: 1, createdAt: -1 });
fileSchema.index({ userId: 1, tags: 1 });
fileSchema.index({ 'sharedWith.userId': 1 });
fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Methods
fileSchema.methods.incrementDownloadCount = async function() {
  this.downloadCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

fileSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

fileSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Statics
fileSchema.statics.findByUser = function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ userId, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

fileSchema.statics.search = function(userId, query) {
  return this.find({
    userId,
    isDeleted: false,
    $or: [
      { originalName: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ]
  });
};

fileSchema.statics.countByUser = function(userId) {
  return this.countDocuments({ userId, isDeleted: false });
};

fileSchema.statics.findByFolder = function(userId, folder) {
  return this.find({ userId, folder, isDeleted: false })
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('File', fileSchema);