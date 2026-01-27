const router = require('express').Router();
const controller = require('../controllers/student.controller');
const validator = require('../../../middlewares/validator.middleware');
const { uploadExcel } = require('../../../middlewares/upload.middleware');
const validation = require('../validations/student.validation');

router.post(
  '/',
  validator(validation.createOrUpdate),
  controller.createOrUpdate,
);
router.get('/', controller.list);
router.get('/export', controller.exportStudents);
router.post('/import', uploadExcel.single('file'), controller.importStudents);
router.get('/:id', validator(validation.idParam), controller.info);
router.delete('/:id', validator(validation.idParam), controller.remove);

module.exports = router;
