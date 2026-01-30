const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
  checkPermissionDynamic,
} = require('../../../middlewares/permission.middleware');
const validator = require('../../../middlewares/validator.middleware');
const controller = require('../controllers/permission.controller');
const validation = require('../validations/permission.validation');

router.use(authMiddleware);
router
  .route('/')
  .get(checkPermission('permission.list'), controller.list)
  .post(
    checkPermissionDynamic({
      create: 'permission.create',
      update: 'permission.update',
    }),
    validator(validation.createOrUpdate),
    controller.createOrUpdate,
  );
router.delete(
  '/:id',
  checkPermission('permission.delete'),
  validator(validation.idParam),
  controller.remove,
);

module.exports = router;
