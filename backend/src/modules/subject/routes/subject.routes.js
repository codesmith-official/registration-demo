const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../../middlewares/permission.middleware');
const validator = require('../../../middlewares/validator.middleware');
const controller = require('../controllers/subject.controller');
const validation = require('../validations/subject.validation');

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
