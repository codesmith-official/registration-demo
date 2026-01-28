const Subject = require('../models/subject.model');

const createOrUpdate = async (payload) => {
  if (payload.id) {
    const subject = await Subject.findByPk(payload.id);
    if (!subject) return null;

    await subject.update({ subject: payload.subject });
    return subject;
  }

  return await Subject.create({ subject: payload.subject });
};

const getAll = async () => {
  return await Subject.findAll({
    order: [['id', 'ASC']],
  });
};

const getById = async (id) => {
  return await Subject.findByPk(id);
};

const remove = async (id) => {
  const subject = await Subject.findByPk(id);
  if (!subject) return null;

  await subject.destroy();
  return true;
};

module.exports = {
  createOrUpdate,
  getAll,
  getById,
  remove,
};
