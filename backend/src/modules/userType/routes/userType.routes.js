const router = require('express').Router();
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
  checkPermissionDynamic,
} = require('../../../middlewares/permission.middleware');
const validator = require('../../../middlewares/validator.middleware');
const controller = require('../controllers/userType.controller');
const validation = require('../validations/userType.validation');

router.use(authMiddleware);
router
  .route('/')
  .get(checkPermission('userType.list'), controller.list)
  .post(
    checkPermissionDynamic({
      create: 'userType.create',
      update: 'userType.update',
    }),
    validator(validation.createOrUpdate),
    controller.createOrUpdate,
  );

router
  .route('/:id')
  .get(
    checkPermission('userType.view'),
    validator(validation.idParam),
    controller.info,
  )
  .delete(
    checkPermission('userType.delete'),
    validator(validation.idParam),
    controller.remove,
  );

module.exports = router;
