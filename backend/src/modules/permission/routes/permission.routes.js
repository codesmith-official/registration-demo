const express = require('express');
const router = express.Router();
const validator = require('../../../middlewares/validator.middleware');
const controller = require('../controllers/permission.controller');
const validation = require('../validations/permission.validation');

router.get('/', controller.list);
router.post(
  '/',
  validator(validation.createOrUpdate),
  controller.createOrUpdate,
);
router.delete('/:id', validator(validation.idParam), controller.remove);

module.exports = router;
