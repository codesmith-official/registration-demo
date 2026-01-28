const router = require('express').Router();
const controller = require('../controllers/student.controller');
const validator = require('../../../middlewares/validator.middleware');
const { uploadExcel } = require('../../../middlewares/upload.middleware');
const validation = require('../validations/student.validation');
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
  checkPermissionDynamic,
} = require('../../../middlewares/permission.middleware');

router.use(authMiddleware);
router
  .route('/')
  .get(checkPermission('student.list'), controller.list)
  .post(
    checkPermissionDynamic({
      create: 'student.create',
      update: 'student.update',
    }),
    validator(validation.createOrUpdate),
    controller.createOrUpdate,
  );

router.get('/export', controller.exportStudents);
router.post('/import', uploadExcel.single('file'), controller.importStudents);

router
  .route('/:id')
  .get(
    checkPermission('student.view'),
    validator(validation.idParam),
    controller.info,
  )
  .delete(
    checkPermission('student.delete'),
    validator(validation.idParam),
    controller.remove,
  );

module.exports = router;
