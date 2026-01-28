const router = require('express').Router();
const controller = require('../controllers/userType.controller');
const validator = require('../../../middlewares/validator.middleware');
const validation = require('../validations/userType.validation');
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
  checkPermissionDynamic,
} = require('../../../middlewares/permission.middleware');

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
