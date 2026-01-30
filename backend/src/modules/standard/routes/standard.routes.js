const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
  checkPermissionDynamic,
} = require('../../../middlewares/permission.middleware');
const validator = require('../../../middlewares/validator.middleware');
const controller = require('../controllers/standard.controller');
const validation = require('../validations/standard.validation');

router.use(authMiddleware);
router
  .route('/')
  .get(checkPermission('standard.list'), controller.list)
  .post(
    checkPermissionDynamic({
      create: 'standard.create',
      update: 'standard.update',
    }),
    validator(validation.createOrUpdate),
    controller.createOrUpdate,
  );

router
  .route('/:id')
  .get(
    checkPermission('standard.view'),
    validator(validation.idParam),
    controller.info,
  )
  .delete(
    checkPermission('standard.delete'),
    validator(validation.idParam),
    controller.remove,
  );

module.exports = router;
