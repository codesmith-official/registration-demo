const router = require('express').Router();
const controller = require('../controllers/marksheet.controller');
const validator = require('../../../middlewares/validator.middleware');
const validation = require('../validations/marksheet.validation');
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermissionDynamic,
  checkPermission,
} = require('../../../middlewares/permission.middleware');

router.use(authMiddleware);
router.post(
  '/',
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
