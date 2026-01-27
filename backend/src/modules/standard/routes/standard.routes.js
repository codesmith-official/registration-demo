const express = require('express');
const router = express.Router();
const controller = require('../controllers/standard.controller');
const validator = require('../../../middlewares/validator.middleware');
const validation = require('../validations/standard.validation');

router.post(
  '/',
  validator(validation.createOrUpdate),
  controller.createOrUpdate,
);
router.get('/', controller.list);
router.get('/:id', validator(validation.idParam), controller.info);
router.delete('/:id', validator(validation.idParam), controller.remove);

module.exports = router;
