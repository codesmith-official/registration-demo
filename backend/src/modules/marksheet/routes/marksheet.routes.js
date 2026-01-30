const router = require('express').Router();
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermissionDynamic,
  checkPermission,
} = require('../../../middlewares/permission.middleware');
const validator = require('../../../middlewares/validator.middleware');
const controller = require('../controllers/marksheet.controller');
const validation = require('../validations/marksheet.validation');

router.use(authMiddleware);
router
  .route('/')
  .get(checkPermission('marksheet.list'), controller.list)
  .post(
    checkPermissionDynamic({
      create: 'marksheet.create',
      update: 'marksheet.update',
    }),
    validator(validation.createOrUpdate),
    controller.createOrUpdate,
  );

router.get(
  '/:student_id',
  checkPermission('marksheet.view'),
  validator(validation.studentParam),
  controller.getByStudent,
);

module.exports = router;
