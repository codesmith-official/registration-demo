const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../../middlewares/permission.middleware');
const validator = require('../../../middlewares/validator.middleware');
const controller = require('../controllers/user.controller');
const validation = require('../validations/user.validation');

router
  .route('/')
  .all(authMiddleware)
  .get(checkPermission('user.list'), controller.getAllUsers)
  .post(
    checkPermission('user.create'),
    validator(validation.createUser),
    controller.createUser,
  );

router.post('/login', validator(validation.login), controller.login);
router.get('/me', authMiddleware, controller.getMe, controller.getUser);

router.post(
  '/assign-standards',
  authMiddleware,
  checkPermission('standard.assign'),
  validator(validation.assignStandardsToUser),
  controller.assignStandardsToUser,
);

router
  .route('/:id')
  .all(authMiddleware)
  .get(
    checkPermission('user.view'),
    validator(validation.idParam),
    controller.getUser,
  )
  .patch(
    checkPermission('user.update'),
    validator(validation.updateUser),
    controller.updateUser,
  )
  .delete(
    checkPermission('user.delete'),
    validator(validation.idParam),
    controller.deleteUser,
  );

module.exports = router;
