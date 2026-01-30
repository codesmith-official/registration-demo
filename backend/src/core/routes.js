const express = require('express');
const router = express.Router();

const marksheetRoutes = require('../modules/marksheet/routes/marksheet.routes');
const permissionRoutes = require('../modules/permission/routes/permission.routes');
const standardRoutes = require('../modules/standard/routes/standard.routes');
const studentRoutes = require('../modules/student/routes/student.routes');
const subjectRoutes = require('../modules/subject/routes/subject.routes');
const userRoutes = require('../modules/user/routes/user.routes');
const userTypeRoutes = require('../modules/userType/routes/userType.routes');

router.use('/subjects', subjectRoutes);
router.use('/standards', standardRoutes);
router.use('/students', studentRoutes);
router.use('/marksheets', marksheetRoutes);
router.use('/users', userRoutes);
router.use('/user-types', userTypeRoutes);
router.use('/permissions', permissionRoutes);

module.exports = router;
