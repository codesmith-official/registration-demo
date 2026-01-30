const path = require('path');
const multer = require('multer');
const { checkAndCreateDirectory } = require('../utils/filesystem');

const uploadDir = checkAndCreateDirectory(
  path.join(__dirname, '../public/uploads'),
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `students_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.endsWith('.xlsx')) {
    return cb(new Error('Only .xlsx files are allowed'));
  }
  cb(null, true);
};

const uploadExcel = multer({ storage, fileFilter });

module.exports = {
  uploadExcel,
};
