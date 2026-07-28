// config/gridfs.js
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const crypto = require('crypto');

let bucket = null;

const initGridFS = async () => {
  try {
    if (mongoose.connection.db) {
      bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
      });
    
      return bucket;
    }
    console.error('❌ MongoDB connection not established');
    return null;
  } catch (error) {
    console.error('❌ GridFS initialization error:', error);
    return null;
  }
};

const getGridFSBucket = () => {
  if (!bucket) {
    console.warn('⚠️ GridFS not initialized, attempting to initialize...');
    initGridFS();
  }
  return bucket;
};

// ============================================
// GRIDFS UPLOAD FUNCTION - Returns multer with GridFS storage
// ============================================
const uploadToGridFS = () => {
  // Create storage engine for GridFS
  const storage = multer.memoryStorage();
  
  // File filter
  const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/rtf',
      'application/zip',
      'application/x-zip-compressed'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  };

  // Create multer instance
  const multerInstance = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
  });

  // Override the single method to handle GridFS upload
  const originalSingle = multerInstance.single.bind(multerInstance);
  multerInstance.single = function(fieldName) {
    return async function(req, res, next) {
      // First, use multer to parse the file
      const multerMiddleware = originalSingle(fieldName);
      
      multerMiddleware(req, res, async function(err) {
        if (err) {
          return next(err);
        }

        // If no file, continue
        if (!req.file) {
          return next();
        }

        try {
          // Get GridFS bucket
          const bucket = getGridFSBucket();
          if (!bucket) {
            throw new Error('GridFS bucket not initialized');
          }

          // Generate unique filename
          const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}-${req.file.originalname}`;

          // Upload to GridFS
          const uploadStream = bucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
            metadata: {
              originalName: req.file.originalname,
              uploadedBy: req.user ? req.user.id : 'unknown',
              uploadDate: new Date(),
              fileSize: req.file.size
            }
          });

          // Write file to GridFS
          uploadStream.write(req.file.buffer);
          uploadStream.end();

          // Wait for upload to complete
          await new Promise((resolve, reject) => {
            uploadStream.on('finish', () => {
              // Attach GridFS ID to req.file
              req.file.id = uploadStream.id;
              req.file.filename = filename;
              resolve();
            });
            uploadStream.on('error', reject);
          });


          next();
        } catch (error) {
          console.error('❌ GridFS upload error:', error);
          next(error);
        }
      });
    };
  };

  return multerInstance;
};

// ============================================
// OTHER FUNCTIONS
// ============================================
const getFileById = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    if (!bucket) return null;
    
    const files = await bucket.find({ _id: fileId }).toArray();
    return files[0] || null;
  } catch (error) {
    console.error('Error getting file:', error);
    return null;
  }
};

const getFileMetadata = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    if (!bucket) return null;
    
    const files = await bucket.find({ _id: fileId }).toArray();
    return files[0] || null;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    return null;
  }
};

const deleteFile = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    if (!bucket) return false;
    
    await bucket.delete(fileId);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

const fileExists = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    if (!bucket) return false;
    
    const files = await bucket.find({ _id: fileId }).toArray();
    return files.length > 0;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
};

const listUserFiles = async (userId) => {
  try {
    const bucket = getGridFSBucket();
    if (!bucket) return [];
    
    const files = await bucket.find({
      'metadata.uploadedBy': userId
    }).toArray();
    
    return files;
  } catch (error) {
    console.error('Error listing user files:', error);
    return [];
  }
};

const countUserFiles = async (userId) => {
  try {
    const bucket = getGridFSBucket();
    if (!bucket) return 0;
    
    const count = await bucket.find({
      'metadata.uploadedBy': userId
    }).count();
    
    return count;
  } catch (error) {
    console.error('Error counting user files:', error);
    return 0;
  }
};

module.exports = {
  initGridFS,
  getGridFSBucket,
  upload: uploadToGridFS,
  getFileById,
  getFileMetadata,
  deleteFile,
  fileExists,
  listUserFiles,
  countUserFiles,
  gridfsBucket: getGridFSBucket
};