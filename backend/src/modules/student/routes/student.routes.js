const router = require('express').Router();
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
  checkPermissionDynamic,
} = require('../../../middlewares/permission.middleware');
const { uploadExcel } = require('../../../middlewares/upload.middleware');
const validator = require('../../../middlewares/validator.middleware');
const controller = require('../controllers/student.controller');
const validation = require('../validations/student.validation');

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

router.get(
  '/export',
  checkPermission('student.export'),
  controller.exportStudents,
);
router.post(
  '/import',
  checkPermission('student.import'),
  uploadExcel.single('file'),
  controller.importStudents,
);

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

router.route('/standard/:id').get(controller.listByStandard);

module.exports = router;
