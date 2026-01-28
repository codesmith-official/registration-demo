const express = require('express');
const router = express.Router();
const controller = require('../controllers/subject.controller');
const validator = require('../../../middlewares/validator.middleware');
const validation = require('../validations/subject.validation');
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../../middlewares/permission.middleware');

router.use(authMiddleware);
router
  .route('/')
  .get(checkPermission('subject.list'), controller.list)
  .post(
    checkPermission('subject.create'),
    validator(validation.createOrUpdate),
    controller.createOrUpdate,
  );

router
  .route('/:id')
  .get(
    checkPermission('subject.view'),
    validator(validation.idParam),
    controller.info,
  )
  .delete(
    checkPermission('subject.delete'),
    validator(validation.idParam),
    controller.remove,
  );
module.exports = router;
