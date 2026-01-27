const router = require('express').Router();
const controller = require('../controllers/marksheet.controller');
const validator = require('../../../middlewares/validator.middleware');
const validation = require('../validations/marksheet.validation');

router.post(
  '/',
  validator(validation.createOrUpdate),
  controller.createOrUpdate,
);
router.get(
  '/:student_id',
  validator(validation.studentParam),
  controller.getByStudent,
);

module.exports = router;
