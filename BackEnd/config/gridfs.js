const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

// GridFS Bucket Reference
let gfs, gridfsBucket;

// Initialize GridFS
const initGridFS = () => {
  return new Promise((resolve, reject) => {
    const conn = mongoose.connection;
    
    // Initialize GridFS
    gfs = require('gridfs-stream')(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    
    // Get the GridFS bucket
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    
    console.log('✅ GridFS initialized');
    resolve({ gfs, gridfsBucket });
  });
};

// Create Storage Engine for Multer
const createStorage = () => {
  return new GridFsStorage({
    db: mongoose.connection,
    bucketName: 'uploads',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        try {
          // Generate unique filename
          const filename = `${crypto.randomBytes(16).toString('hex')}${path.extname(file.originalname)}`;
          
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
            metadata: {
              originalName: file.originalname,
              userId: req.user ? req.user.id : 'anonymous',
              uploadDate: new Date().toISOString(),
              contentType: file.mimetype,
              fileSize: file.size
            }
          };
          resolve(fileInfo);
        } catch (error) {
          reject(error);
        }
      });
    }
  });
};

// File Filter - Only allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES 
    ? process.env.ALLOWED_FILE_TYPES.split(',') 
    : ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed: ${allowedTypes.join(', ')}`), false);
  }
};

// Create Multer Upload Instance
const upload = () => {
  const storage = createStorage();
  
  return multer({
    storage: storage,
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
    },
    fileFilter: fileFilter
  });
};

// Helper: Get file by ID
const getFileById = (fileId) => {
  return new Promise((resolve, reject) => {
    const id = new mongoose.Types.ObjectId(fileId);
    const files = gfs.files;
    
    files.findOne({ _id: id }, (err, file) => {
      if (err) reject(err);
      resolve(file);
    });
  });
};

// Helper: Get file by filename
const getFileByFilename = (filename) => {
  return new Promise((resolve, reject) => {
    const files = gfs.files;
    
    files.findOne({ filename: filename }, (err, file) => {
      if (err) reject(err);
      resolve(file);
    });
  });
};

// Helper: Delete file from GridFS
const deleteFile = (fileId) => {
  return new Promise((resolve, reject) => {
    const id = new mongoose.Types.ObjectId(fileId);
    
    gridfsBucket.delete(id, (err) => {
      if (err) reject(err);
      resolve({ success: true, message: 'File deleted successfully' });
    });
  });
};

// Helper: Get all files by user
const listUserFiles = (userId, page = 1, limit = 20) => {
  return new Promise((resolve, reject) => {
    const files = gfs.files;
    const skip = (page - 1) * limit;
    
    files.find({ 'metadata.userId': userId })
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray((err, fileList) => {
        if (err) reject(err);
        resolve(fileList);
      });
  });
};

// Helper: Count user files
const countUserFiles = (userId) => {
  return new Promise((resolve, reject) => {
    const files = gfs.files;
    
    files.countDocuments({ 'metadata.userId': userId }, (err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
};

// Helper: Check if file exists
const fileExists = async (fileId) => {
  try {
    const file = await getFileById(fileId);
    return !!file;
  } catch (error) {
    return false;
  }
};

// Helper: Get file metadata
const getFileMetadata = async (fileId) => {
  const file = await getFileById(fileId);
  if (!file) return null;
  
  return {
    id: file._id,
    filename: file.filename,
    originalName: file.metadata?.originalName || file.filename,
    contentType: file.contentType,
    length: file.length,
    uploadDate: file.uploadDate,
    metadata: file.metadata || {}
  };
};

module.exports = {
  initGridFS,
  upload,
  getFileById,
  getFileByFilename,
  deleteFile,
  listUserFiles,
  countUserFiles,
  fileExists,
  getFileMetadata,
  gfs,
  gridfsBucket
};