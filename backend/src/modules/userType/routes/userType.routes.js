const router = require('express').Router();
const controller = require('../controllers/userType.controller');
const validator = require('../../../middlewares/validator.middleware');
const validation = require('../validations/userType.validation');

router.post(
  '/',
  validator(validation.createOrUpdate),
  controller.createOrUpdate,
);
router.get('/', controller.list);
router.get('/:id', validator(validation.idParam), controller.info);
router.delete('/:id', validator(validation.idParam), controller.remove);

module.exports = router;
