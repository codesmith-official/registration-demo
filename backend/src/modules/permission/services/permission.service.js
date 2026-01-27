const Permission = require('../models/permission.model');
const UserTypePermission = require('../models/userTypePermission.model');

const getAll = async () => {
  return await Permission.findAll({
    order: [['id', 'ASC']],
  });
};

const createOrUpdate = async (payload) => {
  if (payload.id) {
    const permission = await Permission.findByPk(payload.id);
    if (!permission) return null;

    await permission.update(payload);
    return await getById(permission.id);
  }

  const permission = await Permission.create(payload);
  return await getById(permission.id);
};

const getById = async (id) => {
  return await Permission.findByPk(id);
};

const remove = async (id) => {
  const student = await Permission.findByPk(id);
  if (!student) return null;

  await student.destroy();
  return true;
};

module.exports = {
  getAll,
  createOrUpdate,
  getById,
  remove,
};
